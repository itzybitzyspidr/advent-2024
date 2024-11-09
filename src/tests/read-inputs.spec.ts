import { getInputAsChunks, getInputAsLines } from "../helpers/read-inputs";

describe('any getInputAsX function', () => {
  test('reads from raw file by default', () => {
    const lines = getInputAsLines(0);
    expect(lines.body).toStrictEqual(['this is the raw header.', 'this is the raw body.']);
  });

  test('can return an empty body', () => {
    const chunks = getInputAsChunks(0, {
      headerLength: 1,
    });

    expect(chunks.header).toStrictEqual(['this is the raw header.']);
    expect(chunks.body).toStrictEqual(['this is the raw body.']);
  });
})

describe('the getInputAsLines function', () => {
  test('includes all lines of file if no header specified', () => {
    const lines = getInputAsLines(0, {
      test: true,
      id: 0,
    });

    expect(lines.header.length).toBe(0);
    expect(lines.body.length).toBe(5);
    expect(lines.body[0]).toBe('this is a header line.');
    expect(lines.body[1]).toBe('line 1');
  });

  test('returns an array of strings with separate header', () => {
    const lines = getInputAsLines(0, {
      test: true,
      id: 0,
      headerLength: 1,
    });

    expect(lines.header.length).toBe(1);
    expect(lines.header[0]).toBe('this is a header line.');
    expect(lines.body.length).toBe(4);
    expect(lines.body[0]).toBe('line 1');
  });
});

describe('the getInputAsChunks function', () => {
  test('includes all chunks of file without removing header', () => {
    const chunks = getInputAsChunks(0, {
      test: true,
      id: 1,
      separator: '\r\n\r\n'
    });

    expect(chunks.header.length).toBe(0);
    expect(chunks.body[0]).toBe('this is a header line.\r\nchunk 1a\r\nchunk 1b');
    expect(chunks.body[1]).toBe('chunk 2a');
  });

  test('returns an array of chunks with the header separated', () => {
    const chunks = getInputAsChunks(0, {
      test: true,
      id: 1,
      separator: '\r\n\r\n',
      headerLength: 1,
    });

    expect(chunks.header.length).toBe(1);
    expect(chunks.body.length).toBe(4);
    expect(chunks.body[3]).toBe('chunk 3a\r\nchunk 3b\r\nchunk 3c');
  });
});
