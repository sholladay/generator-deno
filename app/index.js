'use strict';

const path = require('path');
const stream = require('stream');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const username = require('username');
const fullname = require('fullname');
const firstName = require('first-name');
const gitDescription = require('git-description');
const normalizeUrl = require('normalize-url');
const validatePkgName = require('validate-npm-package-name');
const { slugify, camelize } = require('underscore.string');
const pkg = require('../package.json');
const gitRemote = require('./git-remote');
const git = require('./git');

require('update-notifier')({ pkg }).notify();

const capitalize = (input) => {
    return input[0].toUpperCase() + input.substring(1);
};

const titleize = (input) => {
    return capitalize(input).replace(/-(.)/gu, (match, letter) => {
        return ' ' + letter.toUpperCase();
    });
};

const nonEmpty = (subject) => {
    return (input) => {
        return (input.trim().length > 0) || `A ${subject} is required.`;
    };
};

// All template filenames are prefixed with at least one underscore so that they
// are ignored by tools that care about special files. We remove or replace the
// prefix when we are ready to give the file special meaning.
const filePrefix = '_';
const unprefix = (name) => {
    const hiddenFilePrefix = '__';
    return name.startsWith(hiddenFilePrefix) ?
        name.replace(hiddenFilePrefix, '.') :
        name.replace(filePrefix, '');
};

module.exports = class extends Generator {
    constructor(...args) {
        super(...args);

        this.option('username', {
            type : String,
            desc : 'Author\'s online handle'
        });
        this.option('fullName', {
            type : String,
            desc : 'Author\'s legal name'
        });
        this.option('email', {
            type : String,
            desc : 'Author\'s contact address'
        });
        this.option('website', {
            type : String,
            desc : 'Author\'s website URL'
        });
        this.option('createRemote', {
            type : Boolean,
            desc : 'Create a GitHub repository'
        });
        this.option('accessToken', {
            type : String,
            desc : 'GitHub API token to create a repo'
        });
    }
    async prompting() {
        const prompts = [
            {
                name    : 'pkgName',
                message : 'What shall we name your module?',
                default : this.appname.replace(/\s/gu, '-'),
                filter  : slugify,
                async validate(input) {
                    const validity = validatePkgName(input);
                    return validity.validForNewPackages || validity.errors[0];
                }
            },
            {
                name    : 'description',
                message : 'How would you describe it?',
                filter  : capitalize,
                validate(input) {
                    return (input.trim().length > 5 && input.includes(' ')) ||
                        'Oh come on, be creative.';
                }
            },
            {
                name    : 'username',
                message : 'What is your username?',
                store   : true,
                default : username,
                filter(input) {
                    return input.toLowerCase();
                },
                validate : nonEmpty('username'),
                when     : !this.options.username
            },
            {
                name     : 'fullName',
                message  : 'What is your full name?',
                store    : true,
                default  : fullname,
                validate : nonEmpty('name'),
                when     : !this.options.fullName
            },
            {
                name    : 'email',
                message : 'What is your e-mail?',
                store   : true,
                default : this.user.git.email(),
                validate(input) {
                    return input.trim().length > 0 ?
                        (input.includes('@') || 'You forgot the @ sign.') :
                        'An e-mail address is required.';
                },
                when : !this.options.email
            },
            {
                name     : 'website',
                message  : 'What is your web URL?',
                store    : true,
                filter(input) {
                    return normalizeUrl(input, { defaultProtocol : 'https:' });
                },
                validate : nonEmpty('website'),
                when     : !this.options.website
            },
            {
                name    : 'createRemote',
                message : 'Create remote repository?',
                type    : 'confirm',
                default : Boolean(this.options.createRemote),
                when    : typeof this.options.createRemote === 'undefined'
            },
            {
                name     : 'accessToken',
                message  : 'Enter your access token:',
                type     : 'password',
                store    : true,
                validate : nonEmpty('access token'),
                when     : (answer) => {
                    return answer.createRemote && !this.options.accessToken;
                }
            }
        ];

        const casualName = await firstName();
        // Say hello to the user.
        this.log(yosay(`Hey ${chalk.bold.blue(casualName)}. Let's write some code.`));

        const answer = await this.prompt(prompts);
        const { pkgName } = answer;

        // If the user did not bother creating the working directory
        // just for us, then we should store everything in a new
        // subdirectory to avoid puking on their workspace.
        if (pkgName !== slugify(this.appname)) {
            this.destinationRoot(pkgName);
            this.customDir = this.destinationRoot();
        }

        this.props = {
            ...this.options,
            ...answer,
            year      : new Date().getUTCFullYear(),
            jsPkgName : camelize(pkgName),
            pkgTitle  : titleize(pkgName)
        };
        this.props.repoUrl = 'https://github.com/' + path.posix.join(
            this.props.username, pkgName
        );
    }
    async git() {
        const { props } = this;
        const { pkgName, description } = props;

        await git('init --quiet');
        await Promise.all([
            gitRemote.setOrigin(`git@github.com:${props.username}/${pkgName}.git`),
            gitDescription.set(description)
        ]);

        if (props.createRemote) {
            await gitRemote.create(pkgName, props.accessToken, { description });
        }
    }
    writing() {
        const templates = [this.sourceRoot()];

        this.registerTransformStream(new stream.Transform({
            objectMode : true,
            transform(file, encoding, callback) {
                // Only process template files.
                if (file.basename.startsWith(filePrefix)) {
                    file.path = path.join(file.dirname, unprefix(file.basename));
                }
                callback(null, file);
            }
        }));

        this.fs.copyTpl(templates, this.destinationRoot(), this.props);
    }
    install() {
        if (this.customDir) {
            const relativePath = path.relative(process.env.PWD || process.cwd(), this.customDir);
            this.log(`Go to your project: cd '${relativePath}'\n`);
        }
    }
};
