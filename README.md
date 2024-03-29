# VolunteerZ Application

> Social media app for volunteers in Tunisia - Built with Ionic

<div>
    <a href="https://ionicframework.com"><img src="src/assets/img/ionic-logo.png" alt="Ionic" width="250"></a>
</div>

## Table of Contents

1. [Getting Started](#getting-started)
2. [Pages](#pages)
3. [Providers](#providers)
4. [i18n](#i18n) (adding languages)
5. [Testing](#testing)

## Getting Started

To run this project, install the latest version of the Ionic CLI & Node.js and run:

```bash
npm i
ionic serve
```
**NOTE:** If you have any issues with the commands above, you can reach out to us.

### Tips

In production, you will need to enable CORS in your backend's `src/main/resources/config/application-prod.yml` file. Set the allowed-origins so it works with `ionic serve`:

```yaml
cors:
  allowed-origins: 'http://localhost:8100'
```

## Pages

* Home
* Entities (Admin View)
* Timeline
* Account

## Services

* Login
* Signup
* User
* Event
* Participation
* Comment
* Reaction
* Report
..etc

### User

The `User` service is used to authenticate users through its
`login(accountInfo)` and `signup(accountInfo)` methods, which perform `POST`
requests to an API endpoint.

## i18n (Internationalization)

Internationalization (i18n) with
[ngx-translate](https://github.com/ngx-translate/core). This makes it easy to
change the text used in the app by modifying only one file.

### Adding Languages

To add new languages, add new files to the `src/assets/i18n` directory,
following the pattern of LANGCODE.json where LANGCODE is the language/locale
code (ex: en/gb/de/es/etc.).

## Testing

Testing using Karma & Jasmine.

### Usage

There are a number of scripts in `package.json` you can use to run tests:

```json
"test": "jest",
"test:watch": "jest --watch",
"test:ci": "jest --runInBand",
"test:coverage": "jest --coverage",
"e2e": "ng e2e --port 8100"
```

### Unit Tests

[Jest](https://facebook.github.io/jest/) is used as the unit test runner in this project. Jest is a complete and easy to set-up JavaScript testing solution created by Facebook. Some of its benefits are:

- Fast and sandboxed
- Built-in code coverage reports
- Zero configuration

**NOTE:** If you'd like to convert your project so you can run `ng test` to run your tests, see [Angular CLI: "ng test" with Jest in 3 minutes](https://codeburst.io/angular-6-ng-test-with-jest-in-3-minutes-b1fe5ed3417c).

To run a unit test you have three options.

1. Run `npm test` runs all your created unit-tests
2. Run `npm run test:ci` if you want to run the unit-tests with you favorite CI
3. To create a test-coverage report you can run `npm run test:coverage`

See the unit test example at [`src/app/app.component.spec.ts`](src/app/app.component.spec.ts).

### E2E Tests

The E2E test configuration is from the official [ionic-unit-testing-example](https://github.com/ionic-team/ionic-unit-testing-example) repository. The e2e folder structure has been changed a bit.

```
/e2e
  - pages
  - spec
```

See the example end-to-end test in [`e2e/spec/app.e2e-spec.ts`](e2e/spec/app.e2e-spec.ts).

To run the e2e tests:

```bash
npm run e2e
```

**Developed by**
Bouchemi Firas & Soltani Wassim
