import {
  AbiRegistry,
  Address,
  ArgSerializer,
  ContractFunction,
  EndpointParameterDefinition,
  ResultsParser,
  SmartContract,
  TypeExpressionParser,
  TypeMapper,
} from "@multiversx/sdk-core/out";
import { WspTypes, getInterface, provider } from "../index";

// export const scQuery = async (
//   workspace: WspTypes,
//   funcName = "",
//   args = [],
//   endpointDef?: string
// ) => {
//   try {
//     const { address, abiUrl, implementsInterfaces } = getInterface(workspace);
//     const abiRegistry = await AbiRegistry.create(abiUrl);
//     const abi = new SmartContractAbi(abiRegistry, [implementsInterfaces]);
//     const contract = new SmartContract({
//       address: address,
//       abi: abi,
//     });

//     const query = contract.createQuery({
//       func: new ContractFunction(funcName),
//       args: args,
//     });
//     const queryResponse = await provider.queryContract(query);
//     const endpointDefinition = contract.getEndpoint(endpointDef || funcName);
//     const parser = new ResultsParser();
//     const data = parser.parseQueryResponse(queryResponse, endpointDefinition);

//     return data;
//   } catch (error) {
//     console.log(`query error for ${funcName}  : `, error);
//   }
// };
export const scQuery = async (
  workspace: WspTypes,
  funcName = "",
  args = []
) => {
  try {
    const { address, abiUrl } = getInterface(workspace);
    const abiRegistry = await AbiRegistry.create(abiUrl);
    const contract = new SmartContract({
      address: address,
      abi: abiRegistry,
    });

    let interaction = contract.methods[funcName](args);
    const query = interaction.check().buildQuery();
    const queryResponse = await provider.queryContract(query);
    const data = new ResultsParser().parseQueryResponse(
      queryResponse,
      interaction.getEndpoint()
    );

    return data;
  } catch (error) {
    console.log(`query error for ${funcName}  : `, error);
  }
};
export const scSimpleQuery = async (
  scAddress: string,
  funcName: string,
  args: any[] = [],
  pureReturn: boolean = false
) => {
  try {
    const contractAddress = new Address(scAddress);
    const contract = new SmartContract({ address: contractAddress });

    const query = contract.createQuery({
      func: new ContractFunction(funcName),
      args: args,
    });
    const resultsParser = new ResultsParser();

    const queryResponse = await provider.queryContract(query);
    if (pureReturn) {
      return queryResponse;
    }
    const bundle = resultsParser.parseUntypedQueryResponse(queryResponse);

    return bundle;
  } catch (error) {
    console.log(error);
  }
};

export const scQueryByFieldsDefinitions = async (
  workspace: WspTypes,
  funcName = "",
  args = [],
  dataFields?: any
) => {
  const {
    address: scAddress,
    abiUrl,
    implementsInterfaces,
  } = getInterface(workspace);
  const abiRegistry = await AbiRegistry.create(abiUrl);
  const contract = new SmartContract({
    address: scAddress,
    abi: abiRegistry,
  });

  const query = contract.createQuery({
    func: new ContractFunction(funcName),
    args: args,
  });

  const queryResponse = await provider.queryContract(query);

  const response = queryResponse.returnData
    .map((item: string) => Buffer.from(item, "base64").toString("hex"))
    .join("@");
  const serializer = new ArgSerializer();
  const typeParser = new TypeExpressionParser();
  const typeMapper = new TypeMapper();

  const fieldDefinitions = dataFields.map(
    ([name, expression]) =>
      new EndpointParameterDefinition(
        name,
        "",
        typeMapper.mapType(typeParser.parse(expression))
      )
  );

  const parsed = serializer.stringToValues(response, fieldDefinitions);

  return parsed;
};
