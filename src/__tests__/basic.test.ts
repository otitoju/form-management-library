// Basic test to ensure Jest is working
describe("Basic Setup", () => {
  it("should run tests", () => {
    expect(true).toBe(true)
  })

  it("should handle basic math", () => {
    expect(2 + 2).toBe(4)
  })

  it("should work with strings", () => {
    expect("hello").toBe("hello")
  })

  it("should work with objects", () => {
    const obj = { name: "test", value: 42 }
    expect(obj).toEqual({ name: "test", value: 42 })
  })
})
