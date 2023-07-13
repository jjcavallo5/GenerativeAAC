import { useNavigate } from "react-router-dom";
import styles from "./about.module.css";
import IconArrowBackOutline from "../../icons/arrowBack";

function AboutPage() {

    const navigate = useNavigate();


    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <IconArrowBackOutline className={styles.back} onClick={() => navigate("/")} />
                <h1>About Generative AAC</h1>
            </div>
            
            <div className={styles.content}>
                <h2>Motivtion</h2>
                <p>
                    AAC symbol datasets are few and far between. In looking to create a mobile
                    application for the AAC community, the biggest road block I ran into was
                    finding a library of symbols to use that fit the goals of my application.
                    Libraries like OpenSymbols combine many different datasets of symbols,
                    but almost all of these symbols are protected by license agreements that
                    disallow solo developers like myself from profitting off of the software
                    containing the symbols. This makes the cost of developing and maintaining
                    the software unrealistic, and quickly meant that the mobile application
                    wasn't worth the effort.
                </p>
                <br />
                <p>
                    After giving up on my mobile application for a few months, I revisited the
                    problem in the midst of the ChatGPT-inspired AI explosion. I had gained some
                    experience training and testing deep learning models through internships, so
                    I decided to see if that knowledge could pay off in the realm of AAC symbols.
                    After intense research and experimentation, the GenerativeAAC model was born.
                </p>
                <div className={styles.pageBreak}></div>

                <h2>The Technology Behind Generative AAC</h2>
                <p>
                    Generative AAC utilizes a transfer learning approach from a pre-trained Stable
                    Diffusion model. Stable Diffusion is the most popular open-source generative image
                    model, making it perfect for this task. Out of the box, it excels at producing
                    photo-realistic images. In theory, photorealism is a much harder problem than
                    something like AAC symbols, which are very simplistic in nature, so the model
                    clearly has more than enough capability to accomplish the task at hand.
                </p>
                <br />

                <p>
                    The model was fine-tuned on the Mulberry symbols dataset at a resolution of 512x512
                    pixels. The batch size was limited to a single image, but the gradient accumulated over
                    4 steps before being updated. The learning rate was a constant 0.00001, and training was
                    limited to 15,000 training steps.
                </p>
            </div>
        </div>
    );
}

export default AboutPage;
