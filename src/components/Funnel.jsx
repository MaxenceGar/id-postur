import { useState, useEffect } from "react";

export default function Funnel() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [hasDoneStudy, setHasDoneStudy] = useState(null);
  const [hasDoneCleats, setHasDoneCleats] = useState(null);
  const [animate, setAnimate] = useState(false);

  const urls = {
    etudeComplete: "https://calendly.com/idpostur/etude-posturale-complete",
    returnStudy: "https://calendly.com/idpostur/etude-retour",
    fullCleats: "https://calendly.com/idpostur/reglage-des-cales",
    returnCleats: "https://calendly.com/idpostur/reglages-nouvelles-cales-chaussures",
    fullStudyChild: "https://calendly.com/idpostur/etude-posturale-complete-15-ans",
    fullRetryStudy: "https://calendly.com/idpostur/etude-posturale-nouveau-velo"
  };

  // Animation sur chaque changement d’étape
  useEffect(() => {
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(t);
  }, [step]);

  // ************************************************
  // NOUVELLE FONCTION RETOUR
  // ************************************************
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      
      // Gestion des retours pour nettoyer l'état si nécessaire
      if (step === 3 && service === "study") {
        // Retour de l'étape 3 (déjà venu) à l'étape 2 (âge)
        setHasDoneStudy(null);
      }
      if (step === 4 && service === "study") {
        // Retour de l'étape 4 (choix formule) à l'étape 3 (déjà venu)
        setHasDoneStudy(null); 
      }
    }
  };
  // ************************************************

  // ************************************************
  // COMPOSANT CARD (Base de départ conservée)
  // ************************************************
  const Card = ({ title, price, time, desc, onClick }) => {
    // 1. Préparer l'objet pour l'injection HTML
    const descHtml = { __html: desc };
    
    return (
      <div
        onClick={onClick}
        className="cursor-pointer border border-id-postur-dark bg-white p-5 shadow-sm hover:shadow-md transition space-y-3 px-12 py-12 hover:bg-id-postur-dark text-gray-900 hover:text-white"
      >
        <h3 className="font-semibold text-2xl">{title}</h3>
        <div className="w-full h-[1px] bg-id-postur-dark hover:bg-white"></div>
        {time && <p className="hover:text-white text-base mt-1"><span className="font-bold">⏱️ Durée : </span>{time}</p>}
        {price && <p className="thover:text-white text-base mt-1"><span className="font-bold">Prix : </span>{price}</p>}
        {/* 2. Utilisation de dangerouslySetInnerHTML pour le desc */}
        {desc && (
          <p
            className="hover:text-white text-base mt-1 text-left"
            dangerouslySetInnerHTML={descHtml}
          />
        )}
      </div>
    );
  };
  // ************************************************

  const Breadcrumbs = () => (
    <div className="flex items-center text-sm text-gray-500 mb-6 gap-2 justify-center">
      <span className={step >= 1 ? "font-semibold text-black" : ""}>Étape 1</span>
      <span>›</span>
      <span className={step >= 2 ? "font-semibold text-black" : ""}>Étape 2</span>
      <span>›</span>
      <span className={step >= 3 ? "font-semibold text-black" : ""}>Étape 3</span>
      <span>›</span>
      <span className={step >= 4 ? "font-semibold text-black" : ""}>Étape 4</span>
    </div>
  );

  return (
    <div className="w-full justify-center mx-auto p-4 text-center">
      
      <Breadcrumbs />

      <div className={animate ? "fade-enter-active" : "fade-enter"}>
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Quel service souhaitez-vous ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center mx-auto gap-4 w-full md:max-w-7xl">
            <Card
              title="Étude Posturale Complète"
              desc="Analyse détaillée de votre position sur le vélo (confort, performance, prévention des douleurs)."
              onClick={() => { setService("study"); setStep(2); }}
            />

            <Card
              title="Réglage des Cales"
              desc="Optimisez la connexion entre vos pieds, vos chaussures et les pédales."
              onClick={() => { setService("cleats"); setStep(2); }}
            />
            </div>
          </div>
        )}

        {/* SECTION ÉTUDE POSTURALE - ÂGE */}
        {step === 2 && service === "study" && (
          <div className="space-y-4">
            <h2 className="h2-funnel">
              Quel cycliste êtes-vous ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center mx-auto gap-4 w-full md:max-w-7xl">
            <Card
              title="Cycliste de moins de 15 ans"
              time="Durée : 1 heure"
              price="Prix : 120€"
              desc="Étude posturale avec tarif et protocole adaptés aux jeunes cyclistes en pleine croissance."
              onClick={() => (window.location.href = urls.fullStudyChild)}
            />

            <Card
              title="Cycliste de 15 ans et plus"
              desc="Poursuivre la sélection pour choisir la formule d'étude adulte."
              onClick={() => { setHasDoneStudy(true); setStep(3); }}
            />
            </div>
          </div>
        )}

        {/* SECTION ÉTUDE POSTURALE - DÉJÀ VENU ? */}
        {step === 3 && service === "study" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Avez-vous déjà réalisé une étude posturale chez ID Postur ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 mx-auto justify-center gap-4 w-full md:max-w-7xl">
            <Card
              title="Oui, je suis déjà client"
              desc={`Pour un réajustement ou l'ajustement de votre nouveau vélo.<br><br>
                    Étant déjà client ID Postur, nous disposons de vos mesures. Cela permet d'ajuster votre position (ou votre nouveau vélo) plus rapidement et avec une précision optimale.`}
              time="30 minutes"
              price="100€"
              onClick={() => (window.location.href = urls.fullRetryStudy)}
            />
            <Card
              title="Non, c'est ma première étude"
              desc="Sélectionnez cette option si vous n'avez jamais réalisé d'étude posturale chez ID Postur."
              onClick={() => { setHasDoneStudy(true); setStep(4); }}
            />
            </div>
          </div>
        )}
        

        {step === 4 && service === "study" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Quel type d'étude ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 mx-auto justify-center gap-4 max-w-7xl">
            {/* ************************************************ */}
            {/* TEXTES AMÉLIORÉS ET CLARIFIÉS */}
            {/* ************************************************ */}
            <Card
              title="Étude Complète - 1 vélo"
              desc={`Analyse posturale complète et optimisation pour un seul vélo.`}
              time="2h"
              price="250€"
              onClick={() => (window.location.href = urls.etudeComplete)}
            />

            <Card
              title="Étude Complète - 2 vélos"
              desc={`Analyse et ajustement de deux vélos (Ex: Route + Route, ou VTT + VTT) lors du même rendez-vous.`}
              time="2h15"
              price="250€ + 50€"
              onClick={() => alert("Lien non défini pour 2 vélos")}
            />

            <Card
              title="Étude Complète - 2 disciplines"
              desc={`Analyse pour deux vélos de disciplines différentes (Ex: Route + VTT).`}
              time="3h"
              price="250€ + 100€"
              onClick={() => alert("Lien non défini pour 2 disciplines")}
            />
            </div>
          </div>
        )}

        {step === 5 && service === "study" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Souhaitez-vous régler plusieurs vélo ? (Ex: Route + VTT)</h2>

            {hasDoneStudy === false ? (
              <Card
                title="Étude posturale complète"
                time="Description"
                price="250€"
                onClick={() => (window.location.href = urls.fullStudy)}
              />
            ) : (
              <p className="text-gray-600">
                Si ce n’est pas pour un nouveau vélo, vous n’avez pas besoin d’une nouvelle étude.
                Contactez-nous si besoin 😊
              </p>
            )}
          </div>
        )}

        {step === 6 && service === "study" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Votre rendez-vous recommandé :</h2>

            {hasDoneStudy === false ? (
              <Card
                title="Étude posturale complète"
                desc="Description"
                time="2h"
                price="250€"
                onClick={() => (window.location.href = urls.fullStudy)}
              />
            ) : (
              <p className="text-gray-600">
                Si ce n’est pas pour un nouveau vélo, vous n’avez pas besoin d’une nouvelle étude.
                Contactez-nous si besoin 😊
              </p>
            )}
          </div>
        )}

        {/* SECTION CALES */}
        {step === 2 && service === "cleats" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Avez-vous déjà fait un réglage de cales chez ID Postur ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center mx-auto gap-4 w-full md:max-w-7xl">
            <Card
              title="Non, première fois"
              desc="Sélectionnez cette option si vous n'avez jamais fait de réglage de cales chez ID Postur (coût complet)."
              time="20 minutes"
              price="50€"
              onClick={() => (window.location.href = urls.fullCleats)}
            />

            <Card
              title="Oui, client existant"
              desc="Pour un réajustement de cales si vous avez déjà réalisé une étude posturale ou un réglage ici (tarif réduit)."
              time="20 minutes"
              price="30€"
              onClick={() => (window.location.href = urls.returnCleats)}
            />
            </div>
          </div>
        )}

{/* BOUTON RETOUR : Visible à partir de l'étape 2 */}
      {step > 1 && (
        <div className="flex justify-center max-w-7xl mx-auto">
          <button
            onClick={goBack}
            className="text-white text-base font-medium transition duration-150 p-2 left-4 md:left-10 top-4 bg-id-postur-dark my-4"
          >
            ← Retour
          </button>
        </div>
      )}

      </div>
    </div>
  );
}