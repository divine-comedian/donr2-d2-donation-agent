[@elizaos/core v0.25.6-alpha.1](../index.md) / GenerationOptions

# Interface: GenerationOptions

Configuration options for generating objects with a model.

## Properties

### runtime

> **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Defined in

[packages/core/src/generation.ts:2044](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2044)

***

### context

> **context**: `string`

#### Defined in

[packages/core/src/generation.ts:2045](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2045)

***

### modelClass

> **modelClass**: [`ModelClass`](../enumerations/ModelClass.md)

#### Defined in

[packages/core/src/generation.ts:2046](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2046)

***

### schema?

> `optional` **schema**: `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[packages/core/src/generation.ts:2047](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2047)

***

### schemaName?

> `optional` **schemaName**: `string`

#### Defined in

[packages/core/src/generation.ts:2048](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2048)

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

#### Defined in

[packages/core/src/generation.ts:2049](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2049)

***

### stop?

> `optional` **stop**: `string`[]

#### Defined in

[packages/core/src/generation.ts:2050](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2050)

***

### mode?

> `optional` **mode**: `"auto"` \| `"json"` \| `"tool"`

#### Defined in

[packages/core/src/generation.ts:2051](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2051)

***

### experimental\_providerMetadata?

> `optional` **experimental\_providerMetadata**: `Record`\<`string`, `unknown`\>

#### Defined in

[packages/core/src/generation.ts:2052](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2052)

***

### verifiableInference?

> `optional` **verifiableInference**: `boolean`

#### Defined in

[packages/core/src/generation.ts:2053](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2053)

***

### verifiableInferenceAdapter?

> `optional` **verifiableInferenceAdapter**: [`IVerifiableInferenceAdapter`](IVerifiableInferenceAdapter.md)

#### Defined in

[packages/core/src/generation.ts:2054](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2054)

***

### verifiableInferenceOptions?

> `optional` **verifiableInferenceOptions**: [`VerifiableInferenceOptions`](VerifiableInferenceOptions.md)

#### Defined in

[packages/core/src/generation.ts:2055](https://github.com/divine-comedian/eliza/blob/main/packages/core/src/generation.ts#L2055)
