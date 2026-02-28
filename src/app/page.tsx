"use client";

import { useState } from "react";
import { openContractCall, showConnect } from "@stacks/connect";
import { STACKS_MAINNET } from "@stacks/network";
import { AnchorMode, PostConditionMode, uintCV } from "@stacks/transactions";

const CONTRACT_ADDRESS = "SP3E0DQAHTXJHH5YT9TZCSBW013YXZB25QFDVXXWY";
const CONTRACT_NAME = "token-swap";

export default function TokenSwap() {
  const [address, setAddress] = useState<string | null>(null);
  const [amountIn, setAmountIn] = useState("");
  const [txId, setTxId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = () => {
    showConnect({
      appDetails: { name: "Stacks Token Swap", icon: "/logo.png" },
      onFinish: () => {
        const userData = JSON.parse(localStorage.getItem("blockstack-session") || "{}");
        setAddress(userData?.userData?.profile?.stxAddress?.mainnet || null);
      },
      userSession: undefined,
    });
  };

  const handleSwap = async () => {
    if (!amountIn || isNaN(Number(amountIn))) return;
    setLoading(true);

    try {
      await openContractCall({
        network: STACKS_MAINNET,
        anchorMode: AnchorMode.Any,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "swap-stx",
        functionArgs: [uintCV(Math.floor(Number(amountIn) * 1000000))],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          setTxId(data.txId);
          setLoading(false);
        },
        onCancel: () => setLoading(false),
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAddLiquidity = async () => {
    if (!amountIn || isNaN(Number(amountIn))) return;
    setLoading(true);

    try {
      await openContractCall({
        network: STACKS_MAINNET,
        anchorMode: AnchorMode.Any,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "add-liquidity",
        functionArgs: [uintCV(Math.floor(Number(amountIn) * 1000000))],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          setTxId(data.txId);
          setLoading(false);
        },
        onCancel: () => setLoading(false),
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">⚡ Token Swap</h1>
        <p className="text-center text-gray-300 mb-8">Swap tokens on Stacks blockchain</p>

        {!address ? (
          <button
            onClick={connectWallet}
            className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-semibold"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Connected</p>
              <p className="font-mono text-sm">{address.slice(0, 10)}...{address.slice(-6)}</p>
            </div>

            <div className="bg-white/10 p-6 rounded-lg space-y-4">
              <div>
                <label className="block text-sm mb-2">Amount (STX)</label>
                <input
                  type="number"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleSwap}
                  disabled={loading || !amountIn}
                  className="bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Swap"}
                </button>
                <button
                  onClick={handleAddLiquidity}
                  disabled={loading || !amountIn}
                  className="bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  Add Liquidity
                </button>
              </div>
            </div>

            {txId && (
              <div className="bg-green-500/20 border border-green-500 p-4 rounded-lg">
                <p className="font-semibold">Transaction Submitted!</p>
                <a
                  href={`https://explorer.hiro.so/txid/${txId}?chain=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:underline text-sm break-all"
                >
                  {txId}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
