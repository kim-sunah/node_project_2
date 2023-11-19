
const signInCheck = (req, res, next) => {
    const { email, password, passwordConfirm, name } = req.body;

    const emailCheck = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

    if (!email || !password || !passwordConfirm || !name) {
        return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    if (!name) return res.status(400).json("성함을 입력해주세요");
    if (!emailCheck.test(email)) {
        return res.status(400).json({ errorMessage: "잘못된 형태의 이메일 형식입니다." });
    }
    if (password.length < 6) {
        return res.status(400).json({ errorMessage: "비밀번호는 6자 이상이여야 합니다." })
    }
    if (password !== passwordConfirm) {
        return res.status(400).json({ errorMessage: "비밀번호와 확인 비밀번호가 불일치합니다." });
    }
    next();
};

module.exports = signInCheck;
