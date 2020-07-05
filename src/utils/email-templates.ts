const FRONT_END_URL = process.env.FRONT_END_URL;
const PASSWORD_RESET_LINK = "/auth/login/verify";

export function accountVerifyTemplate(username: string, token: string) {
    const link = `${FRONT_END_URL}${PASSWORD_RESET_LINK}?token=${token}`;
    return {
        subject: "Account Verify Link",
        html: `Hello ${username}, <br><br><br>Click On this <a href="${link}">link</a> to verify your account. <br>
               <br><br><br>Regards,<br>Bank Team.`
    };
}

export function accountDeletedTemplate(username: string, accId: string) {
    return {
        subject: "Account Deleted !!!",
        html: `Hello ${username}, <br><br><br>Your account with id ******* is deleted. <br>
               <br><br><br>Regards,<br>Bank Team.`
    };
}

export function accountDebitedTemplate(username: string, accId: string, amount: number) {
    return {
        subject: "Account Debited !!!",
        html: `Hello ${username}, <br><br><br>Your account with id ****** is debited by amount ${amount}. <br>
               <br><br><br>Regards,<br>Bank Team.`
    };
}