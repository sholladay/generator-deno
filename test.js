import { promisify } from 'util';
import path from 'path';
import test from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';

let generator;

const mockPrompt = (answer) => {
    return helpers.mockPrompt(generator, {
        pkgName     : 'my-pkg',
        description : 'my description',
        username    : 'meee',
        website     : 'example.com',
        cli         : false,
        ...answer
    });
};

test.beforeEach(async () => {
    await promisify(helpers.testDirectory)(path.join(__dirname, 'temp'));
    generator = helpers.createGenerator('deno:app', ['../app'], null, { skipInstall : true });
});

test.serial('generates expected files', async (t) => {
    mockPrompt();

    await promisify(generator.run.bind(generator))();

    assert.file([
        '.editorconfig',
        '.git',
        '.gitattributes',
        'CONTRIBUTING.md',
        'LICENSE',
        'README.md',
        'main.js',
        'test.js'
    ]);

    // Hack around ava not detecting yeoman-assert.
    t.true(true);
});

test.serial('prompts for description', async (t) => {
    mockPrompt({
        description : 'awesome description'
    });

    await promisify(generator.run.bind(generator))();

    assert.fileContent('.git/description', /^awesome description\n$/u);
    assert.fileContent('README.md', '> awesome description\n');
    // Hack around ava not detecting yeoman-assert.
    t.true(true);
});
