#include-once
#include <file.au3>
#include <Array.au3>

$Run = "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
$regSyl = "HKEY_CURRENT_USER\Software\Syllabification"

;   Read Word

$MyWord = InputBox("Tatar spoken in Romania: Syllabification", "Enter your word:", "", "")
$MyLen = StringLen($MyWord)
$MyPattern = $MyWord
RegWrite($regSyl, "Word", "REG_SZ", $MyWord)

;   Read into array lines of SyllableTypes text file until the EOF is reached and sort the array

Dim $SyllableTypes
If Not _FileReadToArray("SyllableTypes.txt",$SyllableTypes) Then
   MsgBox(4096,"Error", " Error reading log to Array error:" & @error)
   Exit
EndIf
$SyllableTypes[0] = "0" & $SyllableTypes[0]
For $i = 1 to $SyllableTypes[0]
	$SyllableTypes[$i] = StringLen($SyllableTypes[$i]) & $SyllableTypes[$i]
Next
_ArraySort($SyllableTypes)
For $i = 0 to $SyllableTypes[0]
	$SyllableTypes[$i] = StringRight($SyllableTypes[$i], StringLen($SyllableTypes[$i]) - 1)
Next

;   Read into array lines of Consonants text file until the EOF is reached

Dim $Consonants
If Not _FileReadToArray("Consonants.txt",$Consonants) Then
   MsgBox(4096,"Error", " Error reading log to Array error:" & @error)
   Exit
EndIf

;   Read into array lines of Vowels text file until the EOF is reached

Dim $Vowels
If Not _FileReadToArray("Vowels.txt",$Vowels) Then
   MsgBox(4096,"Error", " Error reading log to Array error:" & @error)
   Exit
EndIf

;   Find the Pattern of the Word

For $i = 1 to $Consonants[0]
	$MyPattern = StringReplace($MyPattern, $Consonants[$i], "*")
Next
$MyPattern = StringReplace($MyPattern, "*", "C")
For $i = 1 to $Vowels[0]
	$MyPattern = StringReplace($MyPattern, $Vowels[$i], "V")
Next


;   Check Pattern

$str = $MyPattern
$str = StringReplace($str, "V", "")
$str = StringReplace($str, "C", "")
If StringInStr($str, " ") > 0 Then
MsgBox(0, "Wrong input (a single word expected): ", $MyWord)
Exit
EndIf
If StringLen($str) > 0 Then
MsgBox(0, "Wrong input: ", $MyWord & " / " & $MyPattern)
Exit
EndIf

;   Count Syllables

$str = $MyPattern
$str = StringReplace($str, "C", "")
$CountSyllables = StringLen($str)

;   Divide Word into syllables

$DividedWord = $MyWord
$DividedPattern = $MyPattern
$DividedCount = $CountSyllables

Dim $Syllable[$DividedCount+1]
Dim $lenSyllable[$DividedCount+1]

$Syllable[0] = $DividedCount
$lenSyllable[0] = $DividedCount

For $i = 1 To $DividedCount
$lenSyllable[$i] = 0
$Syllable[$i] = ""
Next

While $DividedCount > 0
    For $i = $SyllableTypes[0] To 1 Step -1
	    For $j = $SyllableTypes[0] To 1  Step -1
	        $EndPattern = $SyllableTypes[$i]
	        If $DividedCount > 1 Then
	        	$EndPattern = $SyllableTypes[$j] & $EndPattern
	        EndIf
            If $lenSyllable[$DividedCount] = 0 Then
	    	If StringRight($DividedPattern, StringLen($EndPattern)) = $EndPattern Then
	            $lenSyllable[$DividedCount] = StringLen($SyllableTypes[$i])
	            $Syllable[$DividedCount] = StringRight($DividedWord, $lenSyllable[$DividedCount])
		        $DividedWord = StringLeft($DividedWord, StringLen($DividedWord)-$lenSyllable[$DividedCount])
                $DividedPattern = StringLeft($DividedPattern, StringLen($DividedPattern)-$lenSyllable[$DividedCount])
		        ExitLoop
            EndIf
            EndIf
        Next
    If $lenSyllable[$DividedCount] > 0 Then
		ExitLoop
    EndIf
Next
$DividedCount = $DividedCount - 1
WEnd

$DividedWord = ""
For $i = 1 To $CountSyllables
	If $i = 1 Then
       $DividedWord = $Syllable[$i]
    Else
       $DividedWord = $DividedWord & "-" & $Syllable[$i]
	EndIf
Next

;   Show Result

MsgBox(0, "Resulted Syllabification", $DividedWord)
