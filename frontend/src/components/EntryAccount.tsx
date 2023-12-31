import React, { useState } from "react";
import Accounts from "./types/accountsModel";
import AccountsView from "./AccountsView";
import AddAccountForms from "./AddAccountForms";
import Account from "./types/accountModel";
import logo from "../assets/logo.png";

async function calculateDebtAndCredit(
  transList: Account[]
): Promise<Record<string, number>> {
  const balances: Record<string, number> = {};

  transList.forEach((transaction: Account) => {
    const { from, to, amount } = transaction;

    // Initialize or update the balance for the 'from' account
    balances[from] = (balances[from] || 0) - parseFloat(amount);

    // Initialize or update the balance for the 'to' account
    balances[to] = (balances[to] || 0) + parseFloat(amount);
  });

  return balances;
}

const myAccounts: Accounts = {
  id: [
    {
      id: "1",
      groupId: "group1",
      from: "AccountA",
      to: "AccountB",
      amount: "100",
    },
    {
      id: "2",
      groupId: "group1",
      from: "AccountA",
      to: "AccountB",
      amount: "100",
    },
    {
      id: "3",
      groupId: "group1",
      from: "AccountA",
      to: "AccountB",
      amount: "100",
    },
  ],
};

const myArrayAccounts: Account[] = myAccounts.id;

const EntryAccount = () => {
  const [accounts, setAccounts] = useState<Account[]>(myArrayAccounts);
  const [currentAccountGroup, setCurretnAccountGroup] = useState<string>("");
  const [balances, setBalances] = useState<Record<string, number>>({});

  const onSave = (newAccount: Account) => {
    setAccounts([...accounts, newAccount]);
  };

  const searchAccountGroup = () => {
    setAccounts(
      myArrayAccounts.filter((e) => {
        return e.groupId === currentAccountGroup;
      })
    );
  };

  const handleEndTheSplit = async () => {
    const result: Record<string, number> = await calculateDebtAndCredit(
      accounts
    );
    setBalances(result);
  };

  return (
    <>
      <section>
        <header>
          <h2>DutchLight</h2>
          <img src={logo} alt="Logo" className="corner-image"></img>
        </header>
        <aside>
          <h3>Entry the group id</h3>
          <div>
            <input
              type="text"
              value={currentAccountGroup}
              onChange={(e) => {
                setCurretnAccountGroup(e.target.value);
              }}
            />
            <input
              type="button"
              value={"Lets Go!"}
              className="button-main"
              onClick={searchAccountGroup}
            />
          </div>
        </aside>
      </section>
      {currentAccountGroup && (
        <section>
          <aside>
            <AccountsView accountArray={accounts} />
          </aside>
          <>
            <AddAccountForms
              currentGroupId={currentAccountGroup}
              onSave={onSave}
            />
          </>
        </section>
      )}
      <section>
        {currentAccountGroup && (
          <aside>
            <div>
              <h2>Account Balances</h2>
              <button className="button-main" onClick={handleEndTheSplit}>
                Calculate Debts and Credits
              </button>
              <div>
                <h3>Results:</h3>
                {Object.entries(balances).map(([account, balance]) => (
                  <div key={account}>
                    <span className="result-account">{account}: </span>
                    <span className="result-balance">
                      {balance < 0
                        ? `Debt: ${Math.abs(balance)}`
                        : `Credit: ${balance}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </section>
    </>
  );
};

export default EntryAccount;
