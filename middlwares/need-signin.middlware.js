require("dotenv").config();

const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        const [authType, authToken] = (authorization || "").split(" ");
        if (!authToken || authType !== "Bearer") {
            res.status(401).send({ errorMessage: "로그인 후 이용 가능한 기능입니다.", });
            return;
        }
        const userInfo = jwt.verify(authToken, process.env.JWT_KEY);
        console.log(userInfo)
        const user = await Users.findOne({ where: { id: userInfo.user.id } })
        res.locals.user = user
        next();
    } catch (err) {
        if (err.message === "jwt expired") {
            return res.status(401).json({
                message: "토큰이 만료되었습니다"
            });
        }

        return res.status(401).json({
            message: "토큰이 손상되었습니다."
        });
    }
};
