import { auth } from "./firebase.js";

const PAYSTACK_PUBLIC_KEY = "pk_test_44b084de7dd0919ef364a3dbff381e3c4b9d164c";

const BACKEND =
"https://snapx-backend-d195.onrender.com";

window.pay = function(plan, price){

    const user = auth.currentUser;

    if(!user){

        alert("Please login first.");
        return;

    }

    const handler = PaystackPop.setup({

        key: PAYSTACK_PUBLIC_KEY,

        email: user.email,

        amount: price * 100,

        currency: "USD",

        metadata:{

            uid: user.uid,

            plan: plan

        },

        callback: async function(response){

            try{

                const verify =
                await fetch(

                    `${BACKEND}/verify-payment`,

                    {

                        method:"POST",

                        headers:{
                            "Content-Type":"application/json"
                        },

                        body:JSON.stringify({

                            reference:response.reference,

                            uid:user.uid,

                            plan:plan

                        })

                    }

                );

                const result =
                await verify.json();

                if(result.success){

                    alert("🎉 Welcome to Snap Verified!");

                    window.location.href =
                    "profile.html";

                }else{

                    alert(result.message);

                }

            }catch(err){

                console.error(err);

                alert("Unable to verify payment.");

            }

        },

        onClose(){

            alert("Payment cancelled.");

        }

    });

    handler.openIframe();

};
