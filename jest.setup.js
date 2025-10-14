// jest.setup.js

// Adiciona os comandos do jest-dom como .toBeInTheDocument()
require('@testing-library/jest-dom');

// --- A CORREÇÃO ESTÁ AQUI ---
// Adiciona as APIs TextEncoder e TextDecoder que estão faltando no ambiente do JSDOM
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;