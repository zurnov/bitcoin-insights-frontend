import { FixedLengthNumberPipe } from './fixed-length-number.pipe';

describe('FixedLengthNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new FixedLengthNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
