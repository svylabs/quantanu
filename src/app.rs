use digest::Digest;
use gloo_console as console;
use lamport_signature_plus::{LamportFixedDigest, SigningKey, VerifyingKey};
use rand::rngs::OsRng;
use rand::Rng;
use rand::SeedableRng;
use sha2::Sha256;
use yew::prelude::*;

pub struct LamportSignatureDemo {
    pub public_key: Option<VerifyingKey<LamportFixedDigest<Sha256>>>,
    pub private_key: Option<SigningKey<LamportFixedDigest<Sha256>>>,
    pub message: Option<String>,
    pub signature: Option<Vec<u8>>,
}

pub enum Msg {
    GenerateKeyPair,
    SignMessage,
    VerifySignature,
    SetText(String),
}

impl Component for LamportSignatureDemo {
    type Message = Msg;
    type Properties = ();

    fn create(ctx: &Context<Self>) -> Self {
        Self {
            public_key: Option::None,
            private_key: Option::None,
            message: Option::None,
            signature: Option::None,
        }
    }

    fn update(&mut self, ctx: &Context<Self>, msg: Self::Message) -> bool {
        //console::log!("Message: {:?}", msg);

        match msg {
            Msg::GenerateKeyPair => {
                let mut rng = OsRng;
                let signing_key = SigningKey::<LamportFixedDigest<Sha256>>::random(rng);
                let verifying_key = VerifyingKey::from(&signing_key);
                self.public_key = verifying_key.into();
                self.private_key = signing_key.into();
                true
            }
            Msg::SignMessage => {
                let message = self.message.as_ref().unwrap();
                let mut signing_key = self.private_key.clone().unwrap();
                let signature = signing_key.sign(message.as_bytes());
                self.signature = Some(signature.unwrap().into());
                //let is_valid = lamport_signature::verify_signature(&self.public_key, message.as_bytes(), &signature);
                //log::info!("Signature is valid: {}", is_valid);*/
                true
            }
            Msg::VerifySignature => {
                let message = "Hello, World!";
                true
            }
            Msg::SetText(new_value) => {
                console::log!("New value: {:?}", &new_value);
                self.message = Some(new_value);
                true
            }
        }
    }

    fn view(&self, ctx: &Context<Self>) -> Html {
        let onchange = ctx.link().callback(|e: Event| {
            let input = e.target_unchecked_into::<web_sys::HtmlInputElement>();
            Msg::SetText(input.value())
        });
        html! {
            <div>
                <h2>{ "Lamport Signature Demo" }</h2>
                <div>
                    <button onclick={ctx.link().callback(|_| (Msg::GenerateKeyPair))}>{ "Generate Key Pair" }</button>
                    <div>
                        <h3>{ "Public Key" }</h3>
                        <pre>{ format!("{:?}", self.public_key) }</pre>
                    </div>
                    <div>
                        <h3>{ "Private Key" }</h3>
                        <pre>{ format!("{:?}", self.private_key) }</pre>
                    </div>
                </div>
                <div>
                    <h3>{ "Sign Message" }</h3>
                    <input type="text" value={self.message.clone()} onchange={onchange} />
                    <button onclick={ctx.link().callback(|_| (Msg::SignMessage))}>{ "Sign" }</button>
                </div>
                <div>
                    <h3>{ "Signature" }</h3>
                    <pre>{ format!("{:?}", self.signature) }</pre>
                </div>
            </div>
        }
    }
}

#[function_component(App)]
pub fn app() -> Html {
    html! {
        <main>
           <h1>{ "Quantanu"} </h1>
           <span class="subtitle">{ "Experiments with Post Quantum Cryptography" }<i class="heart" /></span>
           /*
            <img class="logo" src="https://yew.rs/img/logo.png" alt="Yew logo" />
            <h1>{ "Hello World!" }</h1>
            <span class="subtitle">{ "from Yew with " }<i class="heart" /></span>
            */
            <LamportSignatureDemo />
        </main>
    }
}
