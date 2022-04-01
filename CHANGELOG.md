# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.2.0](https://github.com/ecomfe/react-suspense-boundary/compare/v2.1.0...v2.2.0) (2022-04-01)


### Features

* allow user to create custom cache context ([#18](https://github.com/ecomfe/react-suspense-boundary/issues/18)) ([2a4e56f](https://github.com/ecomfe/react-suspense-boundary/commit/2a4e56f7b027b041b799248a1334516e2a688158))

## [2.1.0](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.3...v2.1.0) (2021-12-31)


### Features

* forward ref for withBoundary ([#17](https://github.com/ecomfe/react-suspense-boundary/issues/17)) ([50c7d01](https://github.com/ecomfe/react-suspense-boundary/commit/50c7d0121686c81df25d6c193b53ab0eab3b3821))
* make refresh controller awaitable ([29e69f5](https://github.com/ecomfe/react-suspense-boundary/commit/29e69f5a02add1de5811ff84cb9594d5275839fe))

### [2.0.3](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.2...v2.0.3) (2021-12-30)


### Bug Fixes

* rollback to non-ESM ([e322ff9](https://github.com/ecomfe/react-suspense-boundary/commit/e322ff925c5c3c113863f7dbed503b1d23b23c67))

### [2.0.2](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.1...v2.0.2) (2021-12-30)


### Bug Fixes

* add types field to package.json ([70c8336](https://github.com/ecomfe/react-suspense-boundary/commit/70c8336ef490f13d8a60d9e6465d7494fecb43dd))

### [2.0.1](https://github.com/ecomfe/react-suspense-boundary/compare/v1.2.3...v2.0.1) (2021-12-30)


### ⚠ BREAKING CHANGES

* publish as pure ESM package
* remove CacheProvider from Boundary
* version 2.0

### Features

* add a boundary with no cache provider ([2442b26](https://github.com/ecomfe/react-suspense-boundary/commit/2442b26654a87edbad1021b8c53ca070cdaa0712))
* provide pending indicator on refreshing a resource ([7c2e030](https://github.com/ecomfe/react-suspense-boundary/commit/7c2e03051051a6ea0bf86a9219da27181f70e22d))
* version 2.0 ([9a20230](https://github.com/ecomfe/react-suspense-boundary/commit/9a20230c796a9bee28db06bb15d852c2840221ec))


### Bug Fixes

* cache should return promise ([fd58125](https://github.com/ecomfe/react-suspense-boundary/commit/fd58125524c8b8d5037aeefbad39a00c82a77eeb))
* export types in package.json ([ad0ce9c](https://github.com/ecomfe/react-suspense-boundary/commit/ad0ce9ce3b3e019b7a300d0772db2609ed16481c))
* fix type of usePreloadResource ([43dd666](https://github.com/ecomfe/react-suspense-boundary/commit/43dd6663a7e89a684210a726c2b8f53d97a0edef))
* remove CacheProvider from Boundary ([f9fd486](https://github.com/ecomfe/react-suspense-boundary/commit/f9fd486914a0752fcf5d48d91aa7fb992861c83f))
* use beta version of use-sync-external-store ([f457e58](https://github.com/ecomfe/react-suspense-boundary/commit/f457e584a4f9823420bed5ad4607b3b734958b48))
* use use-sync-external-store/shim ([18fe4c7](https://github.com/ecomfe/react-suspense-boundary/commit/18fe4c755177e276666f2a3c7789ecc1f79476a2))


* publish as pure ESM package ([bcc0e22](https://github.com/ecomfe/react-suspense-boundary/commit/bcc0e223ee5bb2e3d7656d48f05a140bdee42f24))

## [2.0.0](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.0-beta.9...v2.0.0) (2021-12-29)


### ⚠ BREAKING CHANGES

* publish as pure ESM package

* publish as pure ESM package ([b42d3ed](https://github.com/ecomfe/react-suspense-boundary/commit/b42d3edb7b8fc886fb9abc7550fea4d87ccdf5b4))

## [2.0.0-beta.9](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.0-beta.8...v2.0.0-beta.9) (2021-11-28)


### Bug Fixes

* use beta version of use-sync-external-store ([b1326fa](https://github.com/ecomfe/react-suspense-boundary/commit/b1326faae5454be80a1579613b6f581ee584d02c))

## [2.0.0-beta.8](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.0-beta.7...v2.0.0-beta.8) (2021-11-25)


### Bug Fixes

* use use-sync-external-store/shim ([72d1d41](https://github.com/ecomfe/react-suspense-boundary/commit/72d1d4139f0b679d8545296b6980e5244190bbcf))

## [2.0.0-beta.7](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2021-11-25)


### Bug Fixes

* cache should return promise ([9fb22d5](https://github.com/ecomfe/react-suspense-boundary/commit/9fb22d5f4cae5da466e002eb7bd5f9ba64196f83))

## [2.0.0-beta.6](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2021-11-10)

## [2.0.0-beta.5](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2021-09-27)


### ⚠ BREAKING CHANGES

* remove CacheProvider from Boundary

### Bug Fixes

* remove CacheProvider from Boundary ([c4e6bcf](https://github.com/ecomfe/react-suspense-boundary/commit/c4e6bcf08ed5fff937ecf00ef9378572e1a40051))

## [2.0.0-beta.4](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2021-09-18)


### Bug Fixes

* fix type of usePreloadResource ([04da00d](https://github.com/ecomfe/react-suspense-boundary/commit/04da00dbe2dd24fd20b3fa4dfb171530dcfacb33))

## [2.0.0-beta.3](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2021-09-14)


### Features

* provide pending indicator on refreshing a resource ([3c4d99a](https://github.com/ecomfe/react-suspense-boundary/commit/3c4d99ac6081cdd7704eb9783ca898f1f41e4f14))

## [2.0.0-beta.2](https://github.com/ecomfe/react-suspense-boundary/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2021-09-12)


### Features

* add a boundary with no cache provider ([c329847](https://github.com/ecomfe/react-suspense-boundary/commit/c32984738b1f8f704cc6d7dd22a4185a9e312d68))

## [2.0.0-beta.1](https://github.com/ecomfe/react-suspense-boundary/compare/v1.2.2...v2.0.0-beta.1) (2021-09-12)


### ⚠ BREAKING CHANGES

* version 2.0

### Features

* version 2.0 ([d5cfd64](https://github.com/ecomfe/react-suspense-boundary/commit/d5cfd64e3b065cf7c38be38d43da04b17e987b62))
