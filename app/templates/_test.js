import { assert, runTests, test } from 'https://deno.land/x/std/testing/mod.ts';
import <%= jsPkgName %> from './main.js';

test(function helloWorld() {
    assert.strictEqual(<%= jsPkgName %>(), 'Hello, world!');
});

runTests();
