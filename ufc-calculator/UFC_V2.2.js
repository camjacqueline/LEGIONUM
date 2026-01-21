/**
 * UFC_V2.2.js
 *
 * Purpose:
 * --------
 * Implements calculation logic for UFC (Unités Formant Colonies) based on:
 * - Direct concentration
 * - Filtration on 10 ml and 100 ml
 * - Presence of interfering flora ("envahie flore")
 *
 * The logic reflects laboratory interpretation rules and warning scenarios.
 *
 * IMPORTANT:
 * ----------
 * - This file assumes the presence of corresponding HTML inputs with specific IDs.
 * - No validation beyond numeric coercion is performed.
 * - Results must be interpreted by qualified personnel.
 */


/* =========================================================
   UI HELPER
   ========================================================= */

/**
 * Disables or enables input fields for a given method
 * when the corresponding "envahie flore" checkbox is toggled.
 *
 * @param {string} type - Input group identifier ("d", "n_1", or "n_2")
 */
function toggleInput(type) {
  const checkbox = document.getElementById(`${type}_checkbox`);
  const inputs = document.querySelectorAll(`.${type}_input`);

  inputs.forEach(input => {
    input.disabled = checkbox.checked;

    // When disabled, reset value to 0 to avoid accidental inclusion
    if (input.disabled) {
      input.value = 0;
    }
  });

  console.log(`Inputs for type ${type} toggled.`);
}


/* =========================================================
   CALCULATION PER COLONY TYPE
   ========================================================= */

/**
 * Calculates UFC values independently for each colony type (A–E).
 *
 * - Applies interpretation rules depending on:
 *   - Direct counts
 *   - Filtration counts
 *   - Disabled inputs (envahie flore)
 * - Aggregates textual results per type
 * - Displays warnings when interfering flora is detected
 */
function calculateColoniesPerType() {
  let results = {};
  let envahieFloreDetected = false;
  let colonies = ['A', 'B', 'C', 'D', 'E'];

  colonies.forEach(type => {
    // Read numeric inputs, defaulting to 0
    let d = parseFloat(document.getElementById(`d_${type}`).value) || 0;
    let n_1 = parseFloat(document.getElementById(`n_1_${type}`).value) || 0;
    let n_2 = parseFloat(document.getElementById(`n_2_${type}`).value) || 0;

    // Disabled inputs are encoded as -1 for logic branching
    if (document.getElementById(`d_${type}`).disabled) d = -1;
    if (document.getElementById(`n_1_${type}`).disabled) n_1 = -1;
    if (document.getElementById(`n_2_${type}`).disabled) n_2 = -1;

    let ufc = 0.0;
    let message = "";

    // Standard warning prefix used across improbable scenarios
    let warning =
      "Cas peu probable. Une analyse des causes pouvant amener à ce résultat est recommandée (";

    /* -----------------------------
       CASE WITHOUT ENVAHIE FLORE
       ----------------------------- */
    if (d !== -1 && n_1 !== -1 && n_2 !== -1) {

      /*
        Logic branches follow laboratory interpretation thresholds.
        Each block corresponds to a specific combination of observed counts.
      */

      if (d === 0) {
        if (n_1 === 0) {
          if (n_2 === 0) {
            message = "<10 UFC/L";
          } else if (1 <= n_2 && n_2 <= 100) {
            ufc = n_2 * 10;
          } else if (n_2 > 100) {
            message = ">1 000 UFC/L";
          }
        } else if (1 <= n_1 && n_1 < 10) {
          if (n_2 === 0) {
            message = warning + (n_1 * 100) + " UFC/L)";
          } else if (1 <= n_2 && n_2 <= 100) {
            ufc = (n_1 + n_2) * 1000 / 110;
          } else if (n_2 > 100) {
            message = ">1 000 UFC/L";
          }
        } else if (10 <= n_1 && n_1 <= 100) {
          if (n_2 === 0) {
            message = warning + (n_1 * 100) + " UFC/L)";
          } else if (1 <= n_2 && n_2 <= 100) {
            ufc = (n_1 + n_2) * 1000 / 110;
          } else if (n_2 > 100) {
            ufc = n_1 * 100;
          }
        } else if (n_1 > 100) {
          if (n_2 === 0 || n_2 <= 100) {
            message = warning + ">10 000 UFC/L)";
          } else if (n_2 > 100) {
            message = ">10 000 UFC/L";
          }
        }
      }

      else if (1 <= d && d <= 2) {
        if (n_1 === 0 && n_2 === 0) {
          ufc = d * 5000;
          message = warning + ufc + " UFC/L)";
        } else if (n_1 > 100) {
          message = ">10 000 UFC/L";
        } else if (1 <= n_1 && n_1 <= 100) {
          if (n_2 === 0) {
            message = warning + Math.max(d * 5000, n_1 * 100) + " UFC/L)";
          } else if (1 <= n_2 && n_2 <= 100) {
            ufc = Math.max(d * 5000, (n_1 + n_2) * 1000 / 110);
          } else if (n_2 > 100) {
            ufc = Math.max(d * 5000, n_1 * 100);
          }
        }
      }

      else if (3 <= d && d <= 150) {
        if (n_1 === 0) {
          message = warning + (d * 5000) + " UFC/L)";
        } else if (1 <= n_1 && n_1 <= 100) {
          if (n_2 === 0) {
            message = warning + Math.max(d * 5000, n_1 * 100) + " UFC/L)";
          } else if (1 <= n_2 && n_2 <= 100) {
            ufc = Math.max(d * 5000, (n_1 + n_2) * 1000 / 110);
          } else if (n_2 > 100) {
            ufc = Math.max(d * 5000, n_1 * 100);
          }
        } else if (n_1 > 100) {
          if (n_2 <= 100) {
            if (d * 5000 > 10000) {
              message = warning + (d * 5000) + " UFC/L)";
            } else {
              message = warning + ">10 000 UFC/L)";
            }
          } else if (n_2 > 100) {
            if (d * 5000 > 10000) {
              ufc = d * 5000;
            } else {
              message = ">10 000 UFC/L";
            }
          }
        }
      }

      else if (d > 150) {
        message = ">750 000 UFC/L";
      }
    }

    /* -----------------------------
       CASE WITH ENVAHIE FLORE
       ----------------------------- */
    if (d === -1 || n_1 === -1 || n_2 === -1) {
      envahieFloreDetected = true;

      /*
        Disabled inputs represent analytical interference.
        Messages reflect raised detection thresholds or impossibility
        of interpretation.
      */

      if (d === -1 && n_1 === -1 && n_2 === -1) {
        message = "Présence d'une flore interférente empêchant la détection des Legionella.";
      } else if (d === 0 && n_1 === -1 && n_2 === -1) {
        message = "Présence d'une flore interférente portant le seuil de détection des Legionella à 5 000 UFC/L. Legionella non détectées.";
      } else if (d === -1 && n_1 === 0 && n_2 === -1) {
        message = "Présence d'une flore interférente portant le seuil de détection des Legionella à 100 UFC/L. Legionella non détectées.";
      } else if (d === 0 && n_1 === 0 && n_2 === -1) {
        message = "Présence d'une flore interférente portant le seuil de détection des Legionella à 100 UFC/L. Legionella non détectées.";
      } else if (d === -1 && n_1 === -1 && n_2 === 0) {
        message = "Legionella non détectées.";
      } else if (d === -1 && n_1 <= 100 && n_2 <= 100) {
        ufc = (n_1 + n_2) * 1000 / 110;
      } else if (d <= 150 && n_1 === -1 && n_2 <= 100) {
        ufc = d * 5000;
      } else if (d <= 150 && n_1 <= 100 && n_2 === -1) {
        ufc = Math.max(d * 5000, n_1 * 100);
      } else if (d === -1 && n_1 === -1 && n_2 <= 100) {
        ufc = n_2 * 10;
      } else if (d <= 150 && n_1 === -1 && n_2 === -1) {
        ufc = d * 5000;
      } else if (d === -1 && n_1 <= 100 && n_2 === -1) {
        ufc = n_1 * 100;
      }
    }

    // Default message formatting when numeric UFC is computed
    if (message === "") {
      message = "Concentration : " + roundToNearest(ufc) + " UFC/L";
    }

    if (d > 0 || n_1 > 0 || n_2 > 0) {
      results[type] = message;
    }
  });

  // Render output
  let output = "";
  for (let type in results) {
    output += `<p>Type ${type}: <strong>${results[type]}</strong></p>`;
  }

  if (envahieFloreDetected) {
    output += `<p><strong>Présence d'une flore interférente pouvant impacter les résultats.</strong></p>`;
  }

  document.getElementById("resultat").innerHTML = output;
}


/* =========================================================
   NUMERIC ROUNDING HELPER
   ========================================================= */

/**
 * Rounds a number to the nearest significant figure
 * using scientific notation.
 *
 * @param {number} number
 * @returns {number}
 */
function roundToNearest(number) {
  const scientificNotation = number.toExponential();
  const [mantissa, exponent] = scientificNotation.split('e');
  const roundedMantissa = Math.round(parseFloat(mantissa) * 10) / 10;
  return parseFloat(roundedMantissa + 'e' + exponent);
}
