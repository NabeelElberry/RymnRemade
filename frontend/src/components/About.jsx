export default function About() {
  function sendEmail(e) {
    e.preventDefault(); //This is important, i'm not sure why, but the email won't send without it

    emailjs
      .sendForm(
        "service_dyduipn",
        "template_2do1w0s",
        e.target,
        "aYr-nBZ7y2V0RR22v"
      )
      .then(
        (result) => {
          window.location.reload(); //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior)
        },
        (error) => {
          console.log(error.text);
        }
      );
  }

  return (
    <>
      <div className="text-4xl pb-10">Hello, thank you for using Rymn!</div>
      <div className="text-2xl">
        Rymn is a program that was inspired by others such as WaniKani, Bunpro,
        and Anki.
      </div>
      <div className="text-2xl">
        It uses the SRS based research system to help people memorize any
        vocabulary.
      </div>
      <div className="text-2xl">
        While the program is mainly for language learning, it can be technically
        be applied to any sort of studying.
      </div>
      <div className="text-2xl pb-10">
        I hope you find it useful and enjoy using it!
      </div>
      <div className="text-lg">
        For any questions, please email rymnappmail@gmail.com.
      </div>
    </>
  );
}
