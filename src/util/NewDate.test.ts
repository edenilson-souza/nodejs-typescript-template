import NewDate from "./NewDate";

describe("NewDate class", () => {
    process.env.TZ = "America/Sao_Paulo";
    test("should return a Date object in UTC timezone - NEW DATE", () => {
        const utc = NewDate.toUTC();
        const now = new Date(Date.now());
        expect(utc).toBeInstanceOf(NewDate);
        expect(utc.getTime()).toBe(now.getTime());
    });

    test("should return a Date object in UTC timezone - STRING", () => {
        const utc_ex = NewDate.toUTC("2021-10-10");
        const date_ex = new Date("2021-10-10");
        expect(utc_ex.getTime()).toBe(date_ex.getTime() + date_ex.getTimezoneOffset() * 60 * 1000);
    });

    test("should return a Date object in UTC timezone - STRING", () => {
        const utc_ex = NewDate.toUTC("2021-10-10T10:00:00");
        const date_ex = new Date("2021-10-10T10:00:00");
        expect(utc_ex.getTime()).toBe(date_ex.getTime());
    });

    test("should return a Date object in UTC timezone - DATE", () => {
        const utc_ex = NewDate.toUTC(new Date("2021-10-10"));
        const date_ex = new Date("2021-10-10");
        expect(utc_ex.getTime()).toBe(date_ex.getTime());
    });

    test("should return a Date object in UTC timezone - DATE", () => {
        const utc_ex = NewDate.toUTC(new Date("2021-10-10T10:00:00"));
        const date_ex = new Date("2021-10-10T10:00:00");
        expect(utc_ex.getTime()).toBe(date_ex.getTime());
    });

    test("should return a Date object in LOCAL timezone - NEW DATE", () => {
        const local = NewDate.toLOCAL();
        const now = new Date(Date.now());
        const nowTime = now.getTime() - now.getTimezoneOffset() * 60 * 1000;
        const calc = nowTime - local.getTime();
        expect(calc).toBeLessThanOrEqual(10);
    });

    test("should return a Date object in LOCAL timezone - STRING", () => {
        const local_ex = NewDate.toLOCAL("2021-10-10");
        const date_ex = new Date("2021-10-10");
        expect(local_ex.getTime()).toBe(date_ex.getTime());
    });

    test("should return a Date object in LOCAL timezone - STRING", () => {
        const local_ex = NewDate.toLOCAL("2021-10-10T13:02:00");
        const date_ex = new Date("2021-10-10T07:02:00");
        expect(local_ex.getTime()).toBe(date_ex.getTime());
    });

    test("should return a Date object in LOCAL timezone - DATE", () => {
        const date_ex = new Date("2021-10-10");
        const local_ex = NewDate.toLOCAL(date_ex);
        expect(local_ex.getTime()).toBe(date_ex.getTime());
    });

    test("should return a Date object in LOCAL timezone - DATE", () => {
        const date_ex = new Date("2021-10-10T13:00:00");
        const local_ex = NewDate.toLOCAL(date_ex);
        expect(local_ex.getTime()).toBe(date_ex.getTime());
    });
});
