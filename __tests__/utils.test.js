const {
  convertTimestampToDate, lookUp
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("lookUp", () => {
  test("returns an object", () => {
      //Arrange
      const input = []
      //Act
      const actual = lookUp(input)
      //Assert
      expect(actual).toEqual({})
  });
  test("returns a single key:value pair for an array with one object", () => {
      //Arrange
      const input = [
        { article_title: "They're not exactly dogs, are they?",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: "butter_bridge",
          created_at: 1586179020000,
          article_id: 1
        } ]
      //Act
      const actual = lookUp(input)
      //Assert
      expect(actual).toEqual({"They're not exactly dogs, are they?": 1})
  });
  test("returns multiple key:value pairs when passed an array with multiple objects", () => {
      //Arrange
      const input = 
      [
        {
          article_title: "They're not exactly dogs, are they?",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: "butter_bridge",
          created_at: 1586179020000,
          article_id: 1
        },
        {
          article_title: "Living in the shadow of a great man",
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 14,
          author: "butter_bridge",
          created_at: 1604113380000,
          article_id: 2
        },
        {
          article_title: "Living in the shadow of a great man",
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
          votes: 100,
          author: "icellusedkars",
          created_at: 1583025180000,
          article_id: 2
        },]
      //Act
      const actual = lookUp(input)
      //Assert
      expect(actual).toEqual({"Living in the shadow of a great man": 2, "They're not exactly dogs, are they?": 1})
  })
});
