# Smart Contracts

Smart contracts are a first-class language construct in C!. The compiler understands contract semantics and can verify correctness properties that are impossible to check in Solidity.

## Why C! for Smart Contracts?

| Vulnerability | Solidity | C! |
|---|---|---|
| Reentrancy | Runtime guard (easy to forget) | Impossible (linear state) |
| Integer overflow | Checked since 0.8.0 | Always checked |
| Double-spend | Manual logic | Impossible (linear tokens) |
| Access control | Modifier pattern | `#[auth]` annotation |
| Invariant violations | Hope and pray | Compiler-verified `#[invariant]` |

## Basic Contract

```
contract Token : ERC20 {
    state total_supply: u256
    state balances: Map<Address, u256>

    #[invariant(sum(balances.values()) == total_supply)]

    init(initial_supply: u256{1..MAX_U256}) {
        total_supply = initial_supply;
        balances[caller] = initial_supply;
        emit Transfer(Address::zero(), caller, initial_supply);
    }

    pub fn transfer(to: Address, amount: u256) -> Result<bool> {
        verify!(to != Address::zero());
        verify!(balances[caller] >= amount);

        balances[caller] -= amount;
        balances[to] += amount;

        emit Transfer(caller, to, amount);
        Ok(true)
    }

    pub pure fn balance_of(owner: Address) -> u256 {
        balances[owner]
    }
}
```

## How Reentrancy Is Prevented

In Solidity, reentrancy is prevented by manually adding a `nonReentrant` modifier. In C!, it's **structurally impossible**.

The `state` in a contract is linearly typed. When a function mutates state, the state is "consumed" for the duration of the function. No external call can re-enter because the state doesn't exist to be accessed:

```
pub fn withdraw(amount: u256) -> Result<()> {
    // State is linearly locked here
    verify!(balances[caller] >= amount);
    balances[caller] -= amount;     // state consumed
    transfer_eth(caller, amount);    // external call is safe — state is locked
    Ok(())
    // State released here
}
```

If an attacker tries to re-enter `withdraw` during `transfer_eth`, the compiler has already consumed the state — re-entry is a compile error.

## Formal Verification

```
#[verify]
contract Vault {
    state deposits: Map<Address, u256>
    state total_locked: u256

    #[invariant(total_locked == sum(deposits.values()))]
    #[property(forall a: Address =>
        withdraw(a, amount).is_ok() implies amount <= deposits[a])]

    pub fn deposit(amount: u256) {
        deposits[caller] += amount;
        total_locked += amount;
    }

    pub fn withdraw(amount: u256) -> Result<()> {
        verify!(deposits[caller] >= amount);
        deposits[caller] -= amount;
        total_locked -= amount;
        transfer_eth(caller, amount);
        Ok(())
    }
}
```

Run verification:

```bash
$ cbang verify contracts/vault.cb

✓ Invariant 'total_locked_sum' holds for all paths
✓ Property 'no_over_withdrawal' proven
✓ No reentrancy possible (linear state)
✓ No integer overflow (bounded arithmetic)

Verification complete: 4/4 properties proven
```

## Deployment

```bash
# Deploy to local testnet
cbang deploy contract.cb --target evm --network local

# Deploy to Ethereum testnet
cbang deploy contract.cb --target evm --network sepolia

# Deploy to Solana
cbang deploy contract.cb --target solana --network devnet
```

## Events

```
contract Token {
    // Events are typed
    event Transfer(from: Address, to: Address, amount: u256)
    event Approval(owner: Address, spender: Address, amount: u256)

    pub fn transfer(to: Address, amount: u256) -> Result<bool> {
        // ...
        emit Transfer(caller, to, amount);
        Ok(true)
    }
}
```

## Contract Inheritance

```
contract MyToken : ERC20, Ownable, Pausable {
    // Inherits all interface requirements
    // Compiler verifies all required functions are implemented
}
```
