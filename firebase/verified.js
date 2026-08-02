import { auth, database } from "./firebase.js";

import {
    ref,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* ==========================================
   Paystack Public Key
========================================== */

const PAYSTACK_PUBLIC_KEY = "pk_test_44b084de7dd0919ef364a3dbff381e3c4b9d164c";

/* ==========================================
   USD → KES Conversion
   Update this whenever you change pricing.
========================================== */

const USD_TO_KES = 130;

/* ==========================================
   Open Paystack Payment
========================================== */

window.pay = function (plan, usdPrice) {

    const user = auth.currentUser;

    if (!user) {
        alert("Please log in first.");
        return;
    }

    if (!user.email) {
        alert("Your account must have an email address.");
        return;
    }

    const amountInKes = Math.round(usdPrice * USD_TO_KES);

    const handler = PaystackPop.setup({

        key: PAYSTACK_PUBLIC_KEY,

        email: user.email,

        amount: amountInKes * 100,

        currency: "KES",

        metadata: {

            uid: user.uid,

            username: user.displayName || "",

            plan: plan,

            usdPrice: usdPrice,

            amountKES: amountInKes

        },

        callback: function (response) {

            console.log("Payment Reference:", response.reference);

            saveVerified(
                plan,
                response.reference
            );

        },

        onClose: function () {

            alert("Payment cancelled.");

        }

    });

    handler.openIframe();

};

/* ==========================================
   Save Verification
========================================== */

function saveVerified(plan, paymentReference) {

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

    const verifiedUntil =
        now +
        (
            months *
            30 *
            24 *
            60 *
            60 *
            1000
        );

    update(

        ref(database, "users/" + user.uid),

        {

            verified: true,

            verifiedPlan: plan,

            verifiedSince: now,

            verifiedUntil: verifiedUntil,

            paymentReference: paymentReference,

            verifiedBadge: true

        }

    )

    .then(() => {

        alert("🎉 Congratulations!");

        alert("Your Snap Verified badge is now active.");

    })

    .catch(error => {

        console.error(error);

        alert("Unable to activate verification.");

    });

}
