document.addEventListener('DOMContentLoaded', function() {
    let isRecording = false;
    let previousText = '';

    function speechToTextConversion() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech Recognition API is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.lang = 'en-IN';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        const textarea = document.querySelector('.textarea');
        const micIcon = document.querySelector('.mic-icon');
        const clipboardIcon = document.querySelector('.clipboard-icon');

        micIcon.addEventListener('click', () => {
            if (!isRecording) {
                micIcon.setAttribute("src", "Icons\stop.png");
                recognition.start();
                isRecording = true;
            } else {
                micIcon.setAttribute("src", "Icons\microphone-black.png");
                recognition.stop();
                isRecording = false;
            }
        });

        recognition.onresult = function(event) {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript + ' ';
                }
            }
            
            finalTranscript = finalTranscript.trim().replace(/\s+/g, ' ');

            if (finalTranscript && finalTranscript !== previousText) {
                textarea.value += finalTranscript + ' ';
                previousText = finalTranscript;
            }
            
            console.log('Confidence: ' + event.results[0][0].confidence);
        };

        recognition.onnomatch = function() {
            textarea.value += 'I didn’t recognize that. ';
        };

        recognition.onerror = function(event) {
            console.error('Speech Recognition Error:', event.error);
            textarea.value += `Error occurred in recognition: ${event.error} `;
        };
    }

    function copyToClipboard() {
        const textarea = document.querySelector('.textarea');
        textarea.select();
        document.execCommand('copy');
        alert('Text copied to clipboard!');
    }

    speechToTextConversion();

    const clipboardIcon = document.querySelector('.clipboard-icon');
    clipboardIcon.addEventListener('click', copyToClipboard);
});
