import { auth, database } from "./firebase.js";

import {
    ref,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const PAYSTACK_PUBLIC_KEY = "pk_test_44b084de7dd0919ef364a3dbff381e3c4b9d164c";

window.pay = function (plan, price) {

    const user = auth.currentUser;

    if (!user) {
        alert("Please log in first.");
        return;
    }

    if (!user.email) {
        alert("Your account needs an email address to use Paystack.");
        return;
    }

    const handler = PaystackPop.setup({

        key: PAYSTACK_PUBLIC_KEY,

        email: user.email,

        currency: "KES",
amount: amountInKes * 100,

        metadata: {
            uid: user.uid,
            username: user.displayName || "",
            plan: plan
        },

        callback: function (response) {

            alert("Payment successful!");

            saveVerified(plan);

        },

        onClose: function () {

            alert("Payment cancelled.");

        }

    });

    handler.openIframe();

};

function saveVerified(plan) {

    const user = auth.currentUser;

    if (!user) return;

    const now = Date.now();

    let months = 3;

    switch (plan) {

        case "6months":
            months = 6;
            break;

        case "9months":
            months = 9;
            break;

        case "1year":
            months = 12;
            break;
    }

    const expires =
        now + (months * 30 * 24 * 60 * 60 * 1000);

    update(ref(database, "users/" + user.uid), {

        verified: true,
        verifiedPlan: plan,
        verifiedSince: now,
        verifiedUntil: expires

    }).then(() => {

        alert("🎉 You are now Snap Verified!");

    });

}
