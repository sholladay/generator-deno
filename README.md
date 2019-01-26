# generator-deno [![Build status for Generator Deno](https://travis-ci.com/sholladay/generator-deno.svg?branch=master "Build Status")](https://travis-ci.com/sholladay/generator-deno "Builds")

> Set up your Deno projects

This [Yeoman](https://yeoman.io) generator will help you scaffold a new [Deno](https://github.com/denoland/deno) app or library.

*Deno is a next-generation server-side runtime for JavaScript and [TypeScript](https://www.typescriptlang.org/). It is an improved version of Node.js, written by Node's original creator, [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl).*

## Why?

 - Deno is awesome and you should use it.
 - No prior knowledge of Deno is required.
 - Can create a repository on GitHub and set up Travis CI.

## Install

```
$ npm install yo generator-deno --global
```

## Usage

Create your new project with [yo](https://github.com/yeoman/yo):

```
$ yo deno
```

View the help for command line options to learn more:

```
$ yo deno --help

  Usage:
    yo deno [options]

  Options:
    --help          # Print the generator's options and usage
    --skip-cache    # Do not remember prompt answers             Default: false
    --skip-install  # Do not automatically install dependencies  Default: false
    ...
```

You will be prompted for any options not passed on the command line. Boolean flags can be negated with the `no` prefix (e.g. `--no-createRemote`).

## Command line options

### `--username`

Example: `--username=janedoe`

Author's online handle

### `--fullName`

Example: `--fullName='Jane Doe'`

Author's full legal name

### `--email`

Example: `--email=jane@doe.com`

Author's contact address

### `--website`

Example: `--website='https://janedoe.com'`

Author's website URL

### `--createRemote`

Example: `--createRemote` or `--no-createRemote`

Create a GitHub repository

### `--accessToken`

Example: `--accessToken='123xyz'`

GitHub API token to create a repo

## Contributing

See our [contributing guidelines](https://github.com/sholladay/generator-deno/blob/master/CONTRIBUTING.md "Guidelines for participating in this project") for more details.

1. [Fork it](https://github.com/sholladay/generator-deno/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/generator-deno/compare "Submit code to this project for review").

## License

[MPL-2.0](https://github.com/sholladay/generator-deno/blob/master/LICENSE "License for generator-deno") © [Seth Holladay](https://seth-holladay.com "Author of generator-deno")

Go make something, dang it.
