// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// HOOK RESPONSIVE TABS INTÉGRÉ (pas de fichier externe)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
function useResponsiveTabs(tabs) {
  const [hiddenTabs, setHiddenTabs] = useState([]);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const tabsRef = useRef(null);
  const wrapperRef = useRef(null);

  const updateHiddenTabs = useCallback(() => {
    if (!tabsRef.current || !wrapperRef.current) return;

    const containerWidth = wrapperRef.current.offsetWidth;
    const tabsContainer = tabsRef.current;
    let totalWidth = 0;
    const visibleTabs = [];
    const newHiddenTabs = [];

    tabs.forEach((tab, index) => {
      const tabElement = tabsContainer.children[index];
      if (tabElement) {
        const tabWidth = tabElement.offsetWidth + 4; // + gap
        if (totalWidth + tabWidth <= containerWidth - 80) { // 80px pour burger
          visibleTabs.push(tab);
          totalWidth += tabWidth;
        } else {
          newHiddenTabs.push(tab);
        }
      }
    });

    setHiddenTabs(newHiddenTabs);
  }, [tabs]);

  useEffect(() => {
    const timeoutId = setTimeout(updateHiddenTabs, 100); // Délai pour render DOM
    
    const resizeObserver = new ResizeObserver(updateHiddenTabs);
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    window.addEventListener('resize', updateHiddenTabs);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateHiddenTabs);
      resizeObserver.disconnect();
    };
  }, [updateHiddenTabs]);

  return {
    hiddenTabs,
    burgerOpen,
    setBurgerOpen,
    updateHiddenTabs,
    tabsRef,
    wrapperRef
  };
}
