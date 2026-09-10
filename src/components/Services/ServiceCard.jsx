import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { getAllMedicalServices, deleteMedicalService } from '../../services/medicalservice';
import ServiceModal from './ServiceModal';
import { initServiceDeckAnimation } from './serviceDeckAnimation';

// Firestore's `services` documents only carry title/description (see
// Addservices.jsx and medicalservice.js - no image field exists yet), so
// there's no per-service image field to read from the data itself. These 5
// commissioned 3D renders (dropped in incoming-assests/ as
// 1-optimized.webp..5-optimized.webp, copied here under names that match
// their subject) are matched to a card by keyword against the service's
// title text at render time - see SERVICE_IMAGE_RULES below. A generic
// fallback covers any future service title that doesn't match one of the
// 5 known departments.
import neurologyImg from '../../assets/images/services/neurology.webp';
import endocrinologyImg from '../../assets/images/services/endocrinology.webp';
import cancerCareImg from '../../assets/images/services/cancer-care.webp';
import mentalHealthImg from '../../assets/images/services/mental-health.webp';
import cardiologyImg from '../../assets/images/services/cardiology.webp';

// Firestore's real titles carry incidental trailing spaces and inconsistent
// casing/spacing ("Endocrinology ", "Cardiology(heart issues) ") - confirmed
// by inspecting the live site's rendered titles rather than assumed. Keyword
// matching against a lowercased, trimmed title sidesteps all of that instead
// of requiring an exact string match per title.
const SERVICE_IMAGE_RULES = [
  { keyword: 'neurology', image: neurologyImg },
  { keyword: 'endocrinology', image: endocrinologyImg },
  { keyword: 'cancer', image: cancerCareImg },
  { keyword: 'mental health', image: mentalHealthImg },
  { keyword: 'cardiology', image: cardiologyImg },
];

const FALLBACK_IMAGES = [neurologyImg, endocrinologyImg, cancerCareImg, mentalHealthImg, cardiologyImg];

const getServiceImage = (title, index) => {
  const normalized = (title || '').trim().toLowerCase();
  const match = SERVICE_IMAGE_RULES.find((rule) => normalized.includes(rule.keyword));
  return match ? match.image : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

const MedicalServicesList = () => {
  const userData = localStorage.getItem("USER");
  let currentUser = null;
  let isAdmin = false;
  if (userData) {
    currentUser = JSON.parse(userData);
    isAdmin = currentUser.isAdmin;
  }

  const [medicalServices, setMedicalServices] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // containerRef: the single parent GSAP pins for the whole section.
  // cardRefs: each card's own absolutely-positioned "shell" layer - GSAP
  // scales/moves this for its stack position, and it stays visible (a
  // plain slate-50 box) for as long as the card is anywhere in the stack.
  // contentRefs: the image+text INSIDE that shell - only ever visible for
  // whichever card is currently front-and-center. See serviceDeckAnimation.js
  // for why these need to be two separate opacity channels, not one.
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const contentRefs = useRef([]);

  const openServiceModal = (service) => {
    setActiveService(service);
    setModalOpen(true);
  };

  const closeServiceModal = () => setModalOpen(false);

  useEffect(() => {
    // Load the medical services from the service when the component mounts
    loadMedicalServices();
  }, []);

  const loadMedicalServices = async () => {
    try {
      const servicesData = await getAllMedicalServices();
      setMedicalServices(servicesData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedicalService(id);
      // Remove the deleted service from the state
      setMedicalServices((prevServices) => prevServices.filter((service) => service.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // Re-run whenever the fetched list changes - the pinned ScrollTrigger and
  // deck timeline need real DOM nodes to measure, and those don't exist
  // until this list has data. Trims the ref array first so a shrinking list
  // (e.g. after a delete) doesn't leave stale nodes from a removed card
  // behind.
  useEffect(() => {
    if (medicalServices.length === 0) return undefined;
    cardRefs.current = cardRefs.current.slice(0, medicalServices.length);
    contentRefs.current = contentRefs.current.slice(0, medicalServices.length);
    return initServiceDeckAnimation({ containerRef, cardRefs, contentRefs });
  }, [medicalServices]);

  return (
    // Pinned for the whole section. Deliberately calc(100vh-80px), not the
    // literal h-screen the brief describes: this container gets pinned
    // starting 80px below the true viewport top (see HEADER_CLEARANCE in
    // serviceDeckAnimation.js, clearing .sticky_header) - a full 100vh box
    // pinned that far down would push its own bottom 80px past the actual
    // viewport edge, clipping exactly the "Learn More" button this rewrite
    // is required to keep visible. flex items-center/justify-center are
    // kept as asked even though the cards inside are position:absolute (so
    // they don't actually participate in this flex alignment) - the real
    // centering happens per-card below via each card's own inset-0 layer.
    <div ref={containerRef} className="services-deck relative flex h-[calc(100vh-80px)] items-center justify-center">
      {medicalServices.map((service, index) => (
        <div
          key={service.id}
          ref={(el) => (cardRefs.current[index] = el)}
          className="service-deck-card absolute inset-0 flex items-center justify-center px-4 will-change-transform md:px-8"
        >
          {/* Shell: the plain slate-50 box - background, border, rounded
              corners, shadow. Stays opacity 1 for as long as this card is
              anywhere in the stack (front, waiting, or mid-exit); nothing
              here ever fades, so a waiting card's "peeking" bottom edge
              always reads as a clean blank card edge, never as a preview
              of its own content. */}
          <div className="h-[75vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl">
            {/* Content: the image+text - this is the ONLY thing that
                fades. A waiting card's shell is fully visible (that's the
                point - you can see its edge peeking out), but its title/
                description/button stay invisible until it's actually the
                front card; otherwise, on mobile especially (image-on-top,
                text-below - much more vertical overlap than desktop's
                side-by-side layout), the waiting card's own text was
                measured bleeding through the front card's translucent
                moments as visible ghosted double text. */}
            <div ref={(el) => (contentRefs.current[index] = el)} className="service-deck-content flex h-full w-full flex-col md:flex-row">
              {/* Image: capped at 40% of the card's height on mobile so the
                  text/button half below always has its guaranteed 60% - on
                  desktop the card is wide, not tall, so the image just takes
                  the full height of its own half-width column. */}
              <div className="relative h-[40%] w-full shrink-0 md:h-full md:w-1/2">
                <img
                  src={getServiceImage(service.title, index)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Text: the other 60% on mobile, `justify-between` between
                  exactly two children - the text block and this footer - so
                  the Learn More button+CTA row anchor together at the bottom
                  of the card (a fixed, predictable spot) instead of spreading
                  apart or floating wherever the description happens to end.
                  Desktop keeps the original vertically-centered feel. */}
              <div className="flex h-[60%] flex-col justify-between overflow-hidden p-6 md:h-full md:w-1/2 md:justify-center md:p-10">
                <div>
                  <h2 className="text-2xl font-semibold leading-tight text-slate-900">
                    {service.title}
                  </h2>
                  {/* line-clamp-3 on mobile only: descriptions are data-driven
                      and vary in length (Endocrinology's and Cardiology's real
                      copy run noticeably longer than the others) - on the
                      shortest common phone viewport (375x667, iPhone SE), an
                      uncapped description was measured pushing the Learn More
                      button/CTA circle past the card's own bottom edge,
                      invisibly clipped by this box's overflow-hidden. Capping
                      to 3 lines keeps the footer's position predictable
                      regardless of device height or copy length; "Learn More"
                      already opens the full, untruncated text in the modal. */}
                  <p className="mt-4 line-clamp-3 text-base leading-relaxed text-slate-600 md:line-clamp-none">
                    {service.description}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => openServiceModal(service)}
                    className="text-sm font-semibold text-cyan-600 hover:underline self-start"
                  >
                    Learn More
                  </button>
                  <div className="flex items-center justify-between mt-5">
                    <Link
                      to="/doctors"
                      className="w-12 h-12 rounded-full border border-solid border-slate-300 flex items-center justify-center group hover:bg-cyan-600 hover:border-transparent"
                    >
                      <BsArrowRight className="text-slate-600 group-hover:text-white w-6 h-5" />
                    </Link>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center">
                      <i
                        className="ri-delete-bin-line text-red-500 cursor-pointer"
                        style={{ margin: '15px' }}
                        size="2x"
                        onClick={() => handleDelete(service.id)}
                      ></i>
                      <Link to={`/updateservice/${service.id}`}>
                        <i className="ri-edit-box-line text-slate-600 cursor-pointer" size="2x"></i>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <ServiceModal isOpen={modalOpen} onClose={closeServiceModal} serviceData={activeService} />
    </div>
  );
};


export default MedicalServicesList;
