import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { selectUserAddress } from "redux/dapp/dapp-slice";
import { fetchElrondData } from "services/rest/elrond";
import useSwr from "swr";
import { IElrondAccountToken } from "types/elrond.interface";
const useGetUserTokens = (
  indentifier?: string,
  onlyEsdt?: boolean,
  size: number = 200
) => {
  const address = useSelector(selectUserAddress);
  const {
    data: userTokens,
    isLoading,
    mutate,
    error,
  } = useSwr<IElrondAccountToken[]>(
    address ? `/accounts/${address}/tokens?size=${size}` : null,
    fetchElrondData
  );
  const acc = useGetAccountInfo();

  const [tokens, setTokens] = useState<IElrondAccountToken[]>([]);
  const [token, setToken] = useState<IElrondAccountToken>();

  useEffect(() => {
    if (userTokens) {
      const newTokens = [...userTokens];
      if (!onlyEsdt) {
        newTokens.push({
          identifier: "EGLD",
          ticker: "EGLD",
          name: "EGLD",
          decimals: 18,
          assets: {
            svgUrl: "/images/egld.svg",
          },
          balance: acc.account?.balance,
        });
      }
      if (indentifier) {
        const newtoken = newTokens.find((t) => t.identifier === indentifier);
        setToken(newtoken);
      }
      setTokens(newTokens);
    }
  }, [acc.account?.balance, userTokens, indentifier, onlyEsdt]);

  return {
    userTokens: tokens || [],
    userToken: token,
    isLoading,
    mutate,
    error,
  };
};

export default useGetUserTokens;
