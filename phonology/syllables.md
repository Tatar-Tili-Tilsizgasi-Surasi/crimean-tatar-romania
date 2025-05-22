# Syllable Structure (Eğík) and Syllabification

The syllable (`eğík`) in Crimean Tatar spoken in Romania has a specific structure and rules governing its formation and division.

## Structure

A syllable consists of a nucleus (determinant sound, usually a vowel) and optional initial (onset, `talaw`) and final (coda, `kuyruk`) margins of determined sounds (consonants/semivowels).

  Syllable (σ)
      |
+-----+-----+
|           |
Onset (ω) Rhyme (ρ)
|
+-----+-----+
| |
Nucleus (v) Coda (κ)


## Phonotactic Constraints

Based on the principle of least effort and sonority sequencing:

*   **Onset:** Contains at most **one** determined sound (consonant/semivowel). Complex onsets (consonant clusters at the start of a syllable) are not allowed.
*   **Nucleus:** Contains exactly **one** determinant sound (vowel). Diphthongs (branching nucleus) are not allowed.
*   **Coda:** Contains at most **two** determined sounds (consonants/semivowels).
*   **Sonority Sequencing Principle (Ótíş tertíbí):** Sonority must fall from the nucleus towards both the onset and the coda. This means vowels are most sonorous, followed by approximants (semivowels, liquids), nasals, fricatives, affricates, and stops (least sonorous). Coda clusters follow this pattern (e.g., a liquid/nasal followed by a stop/fricative).
*   **Harmony Constraint:** Due to intrasyllabic harmony, all sounds within a syllable must be either hard or soft (same tongue root position).

## Maximum Syllable Weight

Given the constraints, the maximum possible syllable structure is **CVCC**, consisting of a consonant, a vowel, and two consonants.

## Syllable Types

Based on the structure and constraints, there are six permissible syllable types:

1.  **V:** (Vowel only) - `o` (this), `a-na` (mother), `e-lek` (hand-sewn), `o-rak` (scythe), `î-rak` (distant), `a-ket-mek` (to intend), `ú-mít` (hope)
2.  **VC:** (Vowel + Consonant) - `az` (little), `el` (hand), `it` (dog), `at` (horse), `in-ğe` (pearl), `er-kek` (man), `al-tî` (six), `ót-mek` (bread)
3.  **CV:** (Consonant + Vowel) - `bo` (this), `şo` (that), `ke` (come!), `ba-bay` (grandfather), `te-rek` (tree)
4.  **CVC:** (Consonant + Vowel + Consonant) - `men` (I), `tór` (background), `kúl` (lake), `kum` (sand), `mî-şîk` (cat), `ta-wuk` (chicken), `ko-lay` (easy), `ot-lak` (pasture)
5.  **VCC:** (Vowel + Consonant + Consonant) - `ant` (oath), `îrk` (root), `ast-ta` (under), `art-mak` (to increase), `úst-ke` (upward)
6.  **CVCC:** (Consonant + Vowel + Consonant + Consonant) - `ğurt` (yurt, homeland), `dórt-lep` (four times), `tart-mak` (to pull), `kart-lar` (old people), `kurt-lar` (worms), `ğu-mart` (generous), `dú-rúst` (correct)

## Syllabification (Al-Kwarizmi Law)

In polysyllabic words, the division into syllables follows a deterministic algorithm, known as the **Al-Kwarizmi law of syllabification**. This law is based on the principle of least effort (Eñ az zahmetlí eğíkleme), which ensures the minimum intersyllabic effort by placing maximum intrasyllabic load on the final syllable.

The process essentially works backward from the end of the word, identifying valid syllable types and ensuring harmony.

A demonstration script for this algorithm (written in AutoIt) can be found in the [`tools`](../tools/) directory.
