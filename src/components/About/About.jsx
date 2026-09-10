import React from 'react' // eslint-disable-line no-unused-vars
// interim placeholder image until a real About-page photo is supplied
import aboutImg from '../../assets/images/extras/extra-doctors-together.png'

// Was previously a dead `<Link to='/'>` - a link to the page it's already
// on, so clicking it did nothing (this is what was reported as a "dead
// button", not the services-grid modal). Fixed to actually scroll to the
// services section below. Goes through Lenis's own API rather than
// scrollIntoView()/scrollTo() directly - Lenis maintains its own animated
// scroll target and silently reverts native scroll changes that don't go
// through it (see SmoothScroll.jsx). Falls back to a plain smooth scroll
// when Lenis isn't running (prefers-reduced-motion has no Lenis instance).
const scrollToServices = () => {
    const target = document.getElementById('services')
    if (!target) return
    if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset: -20 })
    } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

const About = () => {
    return <section>
        <div className="container">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="relative w-full max-w-xs mx-auto lg:max-w-none lg:mx-0 lg:order-1">
                    <img src={aboutImg} alt='' className="w-full h-auto object-cover" />
                </div>

                <div className="lg:order-2 max-w-xl xl:max-w-2xl">
                    <h2 className='heading text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6'>
                        We provide smart integrated services
                    </h2>
                    <p className='text_para mt-0 mb-6 text-lg text-left leading-relaxed text-slate-600'>
                    We, as allopathic physicians, uphold a high standard of professionalism that values patient-centered care.
                    Our integrated approach combines conventional medicine with Traditional Chinese Medicine (TCM), built around a thorough understanding of each patient's individual needs. We offer a range of TCM treatment modalities,
                     including acupuncture, moxibustion, and wet and dry cupping, among others,
                    which have demonstrated efficacy in supporting optimal health and well-being.
                    </p>

                    <p className='text_para mt-0 text-lg text-left leading-relaxed text-slate-600'>
                    At Sheer Health clinic, we prioritize our patients, overall health and wellness in an effort to
                    prevent disease, as much as to treat it when it does occur. Our goal is to deliver unparalleled medical care to our patients.
                     If you are seeking the benefits of integrative medicine and the functional approach to the management of diseases,
                    we welcome you to schedule an appointment with us and experience the highest level of patient care
                    </p>

                    <button type="button" onClick={scrollToServices} className="btn-primary mt-[20px]">Learn More</button>

                </div>
            </div>
        </div>
    </section>
}

export default About