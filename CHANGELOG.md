# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="11.0.0"></a>

## [11.0.0](https://github.com/FelixRilling/chevron/compare/v10.0.0...v11.0.0) (2018-08-07)

breaking: Chevron#set The key is now an optional last parameter which will be inferred from the content if not provided.
breaking: Chevron#set throws an exception if the given key is a duplicate.
breaking: Chevron#get throws an exception if the given key does not exist.
breaking: Chevron#get throws an exception if the injectable has circular dependencies.
breaking: Custom types are done using Chevron#setType rather than setting a property
new: TypeScript decorators @Injectable and @Autowired

<a name="10.0.0"></a>

## [10.0.0](https://github.com/FelixRilling/chevron/compare/v9.0.0...v10.0.0) (2018-08-07)

breaking: removed shorthand type names.
breaking: changed registering of custom types.
