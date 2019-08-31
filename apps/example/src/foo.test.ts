import { foo } from './foo';

test('should output string bar', () => {
  expect(foo()).toBe('bar');
});
