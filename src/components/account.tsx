import { useAccount, useEnsName } from "wagmi";

export function Account() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({
    address,
  });

  return (
    <div>
      {address && (
        <div>
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ensName ? `${ensName} (${address})` : address}
          </a>
        </div>
      )}
    </div>
  );
}
