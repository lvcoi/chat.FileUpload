javascript:(function() {
    const buttonSelector = '#submit-file-button';
    const progressSelector = '#submit-file-progress';
  
    const existingButton = document.querySelector(buttonSelector);
    const existingProgress = document.querySelector(progressSelector);
  
    if (existingButton && existingProgress) {
      existingButton.remove();
      existingProgress.remove();
    } else {
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'submit-file-button-container';
      buttonContainer.style.display = 'flex';
      buttonContainer.style.flexDirection = 'column';
  
      const topButton = document.createElement('button');
      topButton.id = 'submit-file-top-button';
      topButton.innerText = 'Submit File';
      topButton.style.backgroundColor = 'green';
      topButton.style.color = 'white';
      topButton.style.padding = '5px';
      topButton.style.border = 'none';
      topButton.style.borderRadius = '5px';
      topButton.style.marginBottom = '5px';
  
      const bottomButton = document.createElement('button');
      bottomButton.id = 'submit-file-bottom-button';
      bottomButton.innerText = 'Submit File';
      bottomButton.style.backgroundColor = 'blue';
      bottomButton.style.color = 'white';
      bottomButton.style.padding = '5px';
      bottomButton.style.border = 'none';
      bottomButton.style.borderRadius = '5px';
  
      const progress = document.createElement('div');
      progress.id = 'submit-file-progress';
      progress.style.width = '99%';
      progress.style.height = '5px';
      progress.style.backgroundColor = 'grey';
  
      const progressBar = document.createElement('div');
      progressBar.style.width = '0%';
      progressBar.style.height = '100%';
      progressBar.style.backgroundColor = 'blue';
  
      progress.appendChild(progressBar);
  
      const elementLocation = document.querySelector('.flex.flex-col.w-full.py-2.flex-grow');
      elementLocation.parentElement.insertBefore(buttonContainer, elementLocation);
      elementLocation.parentElement.insertBefore(progress, elementLocation);
  
      buttonContainer.appendChild(topButton);
      buttonContainer.appendChild(bottomButton);
  
      async function submitConversation(text, part, filename) {
        const textarea = document.querySelector("textarea[tabindex='0']");
        const enterKeyEvent = new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          keyCode: 13,
        });
        textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
        textarea.dispatchEvent(enterKeyEvent);
      }
  
      topButton.onclick = async () => {
        const textInput = document.createElement('input');
        textInput.type = 'text';
  
        textInput.onchange = async () => {
          const popupWindow = window.open('popup.html', '_blank', 'width=600,height=400');
  
          const fileContent = textInput.value;
          const chunks = fileContent.match(/.{1,15000}/g);
          const numChunks = chunks.length;
  
          for (let i = 0; i < numChunks; i++) {
            await submitConversation(chunks[i], i + 1, 'input.txt');
            progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
  
            let chatgptReady = false;
            while (!chatgptReady) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              chatgptReady = !popupWindow.document.querySelector(".text-2xl > span:not(.invisible)");
            }
          }
  
          progressBar.style.backgroundColor = 'green';
          popupWindow.close();
        };
  
        textInput.click();
      };
    }
  })();