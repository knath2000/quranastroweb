import { h } from 'preact';
import { useStore } from '@nanostores/preact';
import type { ReadableAtom } from 'nanostores';

interface SettingsToggleProps {
  setting: ReadableAtom<boolean>;
  onToggle: () => void;
}

const SettingsToggle = ({ setting, onToggle }: SettingsToggleProps) => {
  const enabled = useStore(setting);
  
  return (
    <button 
      onClick={onToggle}
      className={`relative inline-flex h-8 w-14 items-center rounded-full shadow-lg ${enabled ? 'bg-desertWarmOrange' : 'bg-gray-600'}`}
    >
      <span 
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-md ${enabled ? 'translate-x-7' : 'translate-x-1'}`} 
      />
    </button>
  );
};

export default SettingsToggle;
