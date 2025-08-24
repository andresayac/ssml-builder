import { expect, describe, test } from 'bun:test';
import { BreakElement } from '../../src/elements/BreakElement';

describe('BreakElement', () => {
  test('should render empty break', () => {
    const element = new BreakElement();
    expect(element.render()).toBe('<break/>');
  });

  test('should render break with time', () => {
    const element = new BreakElement({ time: '500ms' });
    expect(element.render()).toBe('<break time="500ms"/>');
  });

  test('should render break with strength', () => {
    const element = new BreakElement({ strength: 'medium' });
    expect(element.render()).toBe('<break strength="medium"/>');
  });

  test('should render break with both time and strength', () => {
    const element = new BreakElement({ time: '500ms', strength: 'medium' });
    expect(element.render()).toContain('time="500ms"');
    expect(element.render()).toContain('strength="medium"');
  });
});
