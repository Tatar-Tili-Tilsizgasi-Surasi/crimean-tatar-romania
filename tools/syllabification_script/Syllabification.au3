; ===================================================================

; Syllabification Script for Khwarezmian Words in Tatar (Romania)

; Based on the algorithm described in

; "The Sounds of Tatar Spoken in Romania" by Taner Murat

;

; Requires AutoIt (https://www.autoitscript.com/site/)

;

; To run:

; 1. Save this code as Syllabification.au3

; 2. Create Vowels.txt, Consonants.txt, SyllableTypes.txt in the same directory

; 3. Install AutoIt

; 4. Run the script with AutoIt (right-click -> Run Script)

;

; Note: This script implements the *specific* algorithm described,

; which works for "Khwarezmian" (authentic) words. It may not

; correctly syllabify all loanwords or words with "academic" sounds

; or structures not adhering to the strict Khwarezmian rules.

; ===================================================================



#include-once

#include <file.au3>

#include <Array.au3>

#include <String.au3> ; Needed for _StringReverse



; --- Configuration ---

; Define registry key for saving last input (optional)

Global Const $RunKey = "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"

Global Const $regSylKey = "HKEY_CURRENT_USER\Software\Syllabification"

Global Const $VOWELS_FILE = "Vowels.txt"

Global Const $CONSONANTS_FILE = "Consonants.txt"

Global Const $SYLLABLE_TYPES_FILE = "SyllableTypes.txt"



; --- Main Script ---

Main()



Func Main()

    ; Get word input from user

    Local $MyWord = InputBox("Tatar spoken in Romania: Syllabification", "Enter your word:", "", "", -1, -1, 0, 0, 60)

    If @error Then Exit ; User cancelled



    ; Save input to registry (optional)

    RegWrite($regSylKey, "LastWord", "REG_SZ", $MyWord)



    ; --- Data Loading ---

    ; Load Syllable Types from file

    Local $aSyllableTypes

    If Not _FileReadToArray($SYLLABLE_TYPES_FILE, $aSyllableTypes) Then

        MsgBox(4096, "Error", "Error reading " & $SYLLABLE_TYPES_FILE & ". Error: " & @error)

        Exit

    EndIf

    ; Add length prefix for sorting by length (longer types first)

    For $i = 1 to $aSyllableTypes[0]

        $aSyllableTypes[$i] = StringLen($aSyllableTypes[$i]) & $aSyllableTypes[$i]

    Next

    ; Sort types by length descending, then alphabetically

    _ArraySort($aSyllableTypes, 1) ; Sort by length ascending initially

    _ArraySort($aSyllableTypes, 1, 1, $aSyllableTypes[0], 0) ; Sort reverse by length (col 0), then alpha (col 1)

    ; Remove length prefix after sorting

    For $i = 1 to $aSyllableTypes[0]

        $aSyllableTypes[$i] = StringRight($aSyllableTypes[$i], StringLen($aSyllableTypes[$i]) - 1)

    Next

    ;$aSyllableTypes[0] holds count after _FileReadToArray



    ; Load Consonants from file

    Local $aConsonants

    If Not _FileReadToArray($CONSONANTS_FILE, $aConsonants) Then

        MsgBox(4096, "Error", "Error reading " & $CONSONANTS_FILE & ". Error: " & @error)

        Exit

    EndIf

    ; Sort consonants by length descending (for correct replacement order)

     _ArraySort($aConsonants, 1, 1, $aConsonants[0], 0) ; Sort reverse alpha initially

     ; Need to sort by length... manually or sort array of lengths?

     ; For simple single characters, alpha sort is fine. If multi-char consonants existed, need length sort.

     ; Assuming single char consonants from Table 8, standard sort is okay.



    ; Load Vowels from file

    Local $aVowels

    If Not _FileReadToArray($VOWELS_FILE, $aVowels) Then

        MsgBox(4096, "Error", "Error reading " & $VOWELS_FILE & ". Error: " & @error)

        Exit

    EndIf

    ; Sort vowels by length descending (for correct replacement order)

     _ArraySort($aVowels, 1, 1, $aVowels[0], 0) ; Assuming single char vowels, standard sort is okay.





    ; --- Pattern Generation and Validation ---

    Local $MyPattern = $MyWord

    ; Replace consonants with 'C' (process multi-char first if applicable)

    For $i = 1 to $aConsonants[0]

        $MyPattern = StringReplace($MyPattern, $aConsonants[$i], "*") ; Use temp char to avoid double-replacement

    Next

    $MyPattern = StringReplace($MyPattern, "*", "C")



    ; Replace vowels with 'V'

    For $i = 1 to $aVowels[0]

        $MyPattern = StringReplace($MyPattern, $aVowels[$i], "V")

    Next



    ; Check for invalid characters (anything not C or V)

    Local $CheckPattern = StringReplace($MyPattern, "C", "")

    $CheckPattern = StringReplace($CheckPattern, "V", "")

    If StringLen($CheckPattern) > 0 Then

        MsgBox(4096, "Wrong input", "Input contains characters not recognized as vowels or consonants: '" & $MyWord & "' generated pattern: '" & $MyPattern & "'")

        Exit

    EndIf



    ; --- Syllabification (Al-Kwarizmi Algorithm) ---

    Local $DividedWord = $MyWord

    Local $DividedPattern = $MyPattern

    Local $DividedCount = 0 ; Number of syllables found



    ; Allocate arrays for syllables and their lengths

    Local $aSyllable[$_StringLen($MyWord) + 1] ; Max possible syllables + 1 for count

    Local $aLenSyllable[$_StringLen($MyWord) + 1]

    $aSyllable[0] = 0 ; Count will be stored at index 0

    $aLenSyllable[0] = 0



    ; The algorithm works backward from the end of the word/pattern

    Local $ReverseWord = _StringReverse($DividedWord)

    Local $ReversePattern = _StringReverse($DividedPattern)



    While StringLen($ReversePattern) > 0



        Local $bFoundSyllable = False



        ; Iterate through syllable types, longest first (due to sorting)

        For $i = 1 to $aSyllableTypes[0]

            Local $SyllableType = _StringReverse($aSyllableTypes[$i]) ; Reverse type to match reverse pattern



            ; Check if the reversed pattern ends with the reversed syllable type

            If StringRight($ReversePattern, StringLen($SyllableType)) = $SyllableType Then



                ; A syllable is found!

                $DividedCount += 1

                Local $lenCurrentSyllable = StringLen($aSyllableTypes[$i]) ; Use original type length

                Local $CurrentSyllable = StringRight($DividedWord, $lenCurrentSyllable)



                ; Store the found syllable at the end of the array for now

                ; We'll reverse the order later

                $aSyllable[$DividedCount] = $CurrentSyllable

                $aLenSyllable[$DividedCount] = $lenCurrentSyllable



                ; Remove the found syllable from the end of the word/pattern

                $DividedWord = StringLeft($DividedWord, StringLen($DividedWord) - $lenCurrentSyllable)

                $DividedPattern = StringLeft($DividedPattern, StringLen($DividedPattern) - $lenCurrentSyllable)

                $ReverseWord = _StringReverse($DividedWord)

                $ReversePattern = _StringReverse($DividedPattern)



                $bFoundSyllable = True

                ExitLoop ; Found the longest possible type, move to the remaining word

            EndIf

        Next



        ; If no valid syllable type was found at the end, something is wrong

        If Not $bFoundSyllable And StringLen($ReversePattern) > 0 Then

            MsgBox(4096, "Syllabification Error", "Could not find a valid syllable type at the end of: '" & _StringReverse($ReverseWord) & "' (pattern: '" & _StringReverse($ReversePattern) & "'). This word may not be a 'Khwarezmian' word or an error occurred.")

            Exit

        EndIf



    WEnd



    ; --- Output ---

    If $DividedCount = 0 Then

         MsgBox(4096, "Syllabification Result", "Could not syllabify the word '" & $MyWord & "'.")

         Exit

    EndIf



    ; The syllables were collected in reverse order, now assemble them correctly

    Local $Result = ""

    For $i = $DividedCount to 1 Step -1

        If $Result <> "" Then

            $Result &= "-"

        EndIf

        $Result &= $aSyllable[$i]

    Next



    MsgBox(64, "Resulted Syllabification", $Result)



EndFunc
