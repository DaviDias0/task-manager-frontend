// Caminho do arquivo: src/services/__mocks__/api.ts

// Exportamos as mesmas funções, mas como 'jest.fn()', que são funções de mock.
export const registerUser = jest.fn();
export const loginUser = jest.fn();
export const getTasks = jest.fn();
export const createTask = jest.fn();
export const updateTask = jest.fn();
export const deleteTask = jest.fn();