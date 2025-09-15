import React, { useState, useEffect } from "react";
import { Modal } from "~/components/Modal";
import styles from "./AntivirusInstallModal.module.scss";

interface AntivirusInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallComplete: () => void;
}

// todo: change some text

export const AntivirusInstallModal: React.FC<AntivirusInstallModalProps> = ({
  isOpen,
  onClose,
  onInstallComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDirectory, setSelectedDirectory] = useState("/home/user/");
  const [installProgress, setInstallProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("Initializing...");
  const [isInstalling, setIsInstalling] = useState(false);

  // Reset installation state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedDirectory("/home/user/");
      setInstallProgress(0);
      setCurrentTask("Initializing...");
      setIsInstalling(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInstall = () => {
    setIsInstalling(true);
    setInstallProgress(0);
    setCurrentTask("Initializing installation...");
  };

  // Installation progress simulation
  useEffect(() => {
    if (!isInstalling) return;

    const tasks = [
      { text: "Initializing installation...", duration: 800 },
      { text: "Checking system requirements...", duration: 1000 },
      { text: "Downloading virus definitions...", duration: 2000 },
      { text: "Extracting installation files...", duration: 1200 },
      { text: "Installing core components...", duration: 1500 },
      { text: "Configuring real-time protection...", duration: 1800 },
      { text: "Setting up quarantine directory...", duration: 1000 },
      { text: "Installing system hooks...", duration: 1200 },
      { text: "Scanning for existing threats...", duration: 2500 },
      { text: "Eliminating detected viruses...", duration: 2000 },
      { text: "Updating virus database...", duration: 1500 },
      { text: "Setting up firewall rules...", duration: 1200 },
      { text: "Configuring automatic updates...", duration: 1000 },
      { text: "Integrating with Ubuntu security...", duration: 1800 },
      { text: "Running system compatibility tests...", duration: 1500 },
      { text: "Optimizing performance settings...", duration: 1200 },
      { text: "Creating backup configuration...", duration: 1000 },
      { text: "Finalizing configuration...", duration: 1200 },
      { text: "Running final security scan...", duration: 1800 },
      { text: "Installation complete!", duration: 1000 }
    ];

    let currentTaskIndex = 0;
    let progress = 0;

    const runInstallation = () => {
      if (currentTaskIndex >= tasks.length) {
        setTimeout(() => {
          console.log("Installation completed!");
          onClose();
          onInstallComplete();
        }, 1000);
        return;
      }

      const task = tasks[currentTaskIndex];
      setCurrentTask(task.text);

      const stepProgress = 100 / tasks.length;
      const targetProgress = (currentTaskIndex + 1) * stepProgress;

      const progressInterval = setInterval(() => {
        progress += 2;
        if (progress >= targetProgress) {
          progress = targetProgress;
          clearInterval(progressInterval);
          currentTaskIndex++;
          setTimeout(runInstallation, 200);
        }
        setInstallProgress(Math.min(progress, 100));
      }, task.duration / (stepProgress / 2));
    };

    runInstallation();
  }, [isInstalling, onClose, onInstallComplete]);

  const renderStep1 = () => (
    <>
      <div className={styles.stepContent}>
        <h2>Terms and Conditions</h2>
        <div className={styles.termsContainer}>
          <div className={styles.termsText}>
            <h3>End User License Agreement (EULA)</h3>
            <p>
              By installing this antivirus software, you agree to the following terms and conditions:
            </p>
            <ul>
              <li>This software is provided "as is" without warranty of any kind</li>
              <li>The software may collect system information for security purposes</li>
              <li>Regular updates will be downloaded automatically</li>
              <li>You grant permission to scan all files on your system</li>
              <li>Real-time protection will monitor system activities</li>
              <li>Quarantined files may be automatically removed</li>
            </ul>
            <p>
              <strong>Privacy Policy:</strong> We respect your privacy and will only collect 
              necessary data to provide security services. No personal files will be transmitted 
              without your explicit consent.
            </p>
            <p>
              <strong>System Requirements:</strong> Ubuntu 18.04 or later, 2GB RAM minimum, 
              500MB free disk space.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.nextButton} onClick={handleNext}>
          I Agree & Continue
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className={styles.stepContent}>
        <h2>Select Installation Directory</h2>
        <div className={styles.directorySelection}>
          <p>Choose where to install the antivirus software:</p>
          <div className={styles.directoryOptions}>
            <label className={styles.directoryOption}>
              <input
                type="radio"
                name="directory"
                value="/home/user/"
                checked={selectedDirectory === "/home/user/"}
                onChange={(e) => setSelectedDirectory(e.target.value)}
              />
              <span>/home/user/</span>
              <small>User directory (Recommended)</small>
            </label>
            <label className={styles.directoryOption}>
              <input
                type="radio"
                name="directory"
                value="/opt/"
                checked={selectedDirectory === "/opt/"}
                onChange={(e) => setSelectedDirectory(e.target.value)}
              />
              <span>/opt/</span>
              <small>System-wide installation</small>
            </label>
            <label className={styles.directoryOption}>
              <input
                type="radio"
                name="directory"
                value="/usr/local/"
                checked={selectedDirectory === "/usr/local/"}
                onChange={(e) => setSelectedDirectory(e.target.value)}
              />
              <span>/usr/local/</span>
              <small>Local system installation</small>
            </label>
          </div>
          <div className={styles.selectedPath}>
            <strong>Installation path:</strong> {selectedDirectory}antivirus/
          </div>
          <div className={styles.diskSpace}>
            <p>Required space: 500 MB</p>
            <p>Available space: 15.2 GB</p>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.backButton} onClick={handleBack}>
          Back
        </button>
        <button className={styles.nextButton} onClick={handleNext}>
          Next
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className={styles.stepContent}>
        <h2>Installation Progress</h2>
        <div className={styles.installationContainer}>
          {!isInstalling ? (
            <div className={styles.readyToInstall}>
              <div className={styles.installationInfo}>
                <h3>Ready to Install</h3>
                <p>The antivirus will be installed to: <strong>{selectedDirectory}antivirus/</strong></p>
                <div className={styles.installSummary}>
                  <h4>Installation Summary:</h4>
                  <ul>
                    <li>Real-time virus protection</li>
                    <li>Automatic virus definition updates</li>
                    <li>System integration with Ubuntu</li>
                    <li>Command-line scanning tools</li>
                    <li>Firewall configuration</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                <h3>Installing Antivirus...</h3>
                <div className={styles.progressPercent}>{Math.round(installProgress)}%</div>
              </div>
              
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${installProgress}%` }}
                  />
                </div>
              </div>
              
              <div className={styles.currentTask}>
                <span className={styles.taskIcon}>⚡</span>
                {currentTask}
              </div>
              
              <div className={styles.virusKillCounter}>
                <div className={styles.killStats}>
                  <span className={styles.killIcon}>🦠</span>
                  <span>Threats eliminated: {Math.floor(installProgress / 10)}</span>
                </div>
                <div className={styles.killStats}>
                  <span className={styles.killIcon}>🔒</span>
                  <span>Files protected: {Math.floor(installProgress * 47)}</span>
                </div>
              </div>
              
              <div className={styles.installingFacts}>
                <h4>🔍 Did you know?</h4>
                <div className={styles.factRotator}>
                  {installProgress < 12 && <p>Ubuntu's package manager (APT) helps prevent malicious software installation by verifying digital signatures</p>}
                  {installProgress >= 12 && installProgress < 24 && <p>Linux viruses often target servers rather than desktop systems, making desktop antivirus important for mixed environments</p>}
                  {installProgress >= 24 && installProgress < 36 && <p>The first Linux virus was discovered in 1996 and was called "Staog" - it infected binary files</p>}
                  {installProgress >= 36 && installProgress < 48 && <p>Ubuntu receives security updates for 5-10 years depending on the version (LTS vs regular releases)</p>}
                  {installProgress >= 48 && installProgress < 60 && <p>Real-time protection monitors file system changes instantly using inotify kernel subsystem</p>}
                  {installProgress >= 60 && installProgress < 72 && <p>ClamAV is one of the most popular open-source antivirus engines, with over 600,000 virus signatures</p>}
                  {installProgress >= 72 && installProgress < 84 && <p>Ubuntu's AppArmor security framework provides mandatory access control to limit program capabilities</p>}
                  {installProgress >= 84 && installProgress < 96 && <p>Linux malware has increased 35% year-over-year, making antivirus protection increasingly important</p>}
                  {installProgress >= 96 && <p>Your system will now be protected with both Ubuntu's built-in security and advanced antivirus scanning!</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button 
          className={styles.backButton} 
          onClick={handleBack}
          disabled={isInstalling}
        >
          Back
        </button>
        <button 
          className={styles.installButton} 
          onClick={handleInstall}
          disabled={isInstalling}
        >
          {isInstalling ? 'Installing...' : 'Install'}
        </button>
      </div>
    </>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Antivirus Installation - Step ${currentStep} of 3`}
      className={styles.antivirusInstallModal}
      fitContentSize={false}
    >
      <div className={styles.container}>
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
            1. Terms
          </div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
            2. Directory
          </div>
          <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>
            3. Install
          </div>
        </div>
        <div className={styles.contentWrapper}>
          {renderCurrentStep()}
        </div>
      </div>
    </Modal>
  );
};
