"use client";
import { useEffect } from "react";
import Link from "next/link";
import { getAddress, AddressPurpose, BitcoinNetworkType } from 'sats-connect';

export default function Home() {
  useEffect(() => {
    // Add homepage class to body for fixed background
    document.body.classList.add('homepage');
    
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownItems = Array.from(document.querySelectorAll('.dropdown-item')) as HTMLElement[];
    const menuIcon = document.querySelector('.menu-icon') as HTMLElement | null;
    const navContainer = document.querySelector('.nav-container') as HTMLElement | null;

    function typeText(element: HTMLElement, text: string, delay: number) {
      element.textContent = '';
      (element as HTMLElement).style.opacity = '1';
      let index = 0;
      function addChar() {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
          setTimeout(addChar, 50);
        }
      }
      setTimeout(addChar, delay);
    }

    const toggleDropdown = () => {
      const wasActive = dropdownMenu?.classList.contains('active');
      dropdownTrigger?.classList.toggle('active');
      dropdownMenu?.classList.toggle('active');
      if (!wasActive && dropdownMenu) {
        const items = [
          { element: dropdownItems[0], text: '\\ WTF', delay: 0 },
          { element: dropdownItems[1], text: '\\ ABOUT', delay: 100 },
          { element: dropdownItems[2], text: '\\ SPONSORS', delay: 200 },
          { element: dropdownItems[3], text: '\\ CONTACT', delay: 300 },
        ];
        items.forEach(i => i.element && typeText(i.element, i.text, i.delay));
      }
    };
    let lastToggle = 0;
    const onPointerUp = (e: PointerEvent) => {
      if (!dropdownTrigger) return;
      e.preventDefault();
      e.stopPropagation();
      if (Date.now() - lastToggle < 250) return;
      lastToggle = Date.now();
      toggleDropdown();
    };
    dropdownTrigger?.addEventListener('pointerup', onPointerUp as EventListener, { passive: false });
    dropdownTrigger?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (Date.now() - lastToggle > 250) toggleDropdown(); });

    const closeOnOutside = (e: MouseEvent) => {
      if (dropdownTrigger && !dropdownTrigger.contains(e.target as Node)) {
        dropdownTrigger.classList.remove('active');
        dropdownMenu?.classList.remove('active');
      }
    };
    document.addEventListener('click', closeOnOutside);

    function updateDateTime() {
      const el = document.getElementById('datetime');
      if (!el) return;
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/New_York',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      };
      const estTime = now.toLocaleString('en-US', options);
      const [date, time] = estTime.split(', ');
      el.textContent = `${date} ${time} EST`;
    }
    updateDateTime();
    const dtInterval = setInterval(updateDateTime, 1000);

    let navManuallyMoved = false;
    function positionRedDot() {
      if (!menuIcon || !dropdownTrigger) return;
      if (navManuallyMoved) return;
      const width = window.innerWidth;
      const triggerRect = dropdownTrigger.getBoundingClientRect();
      const menuHeight = triggerRect.height;
      menuIcon.style.height = `${menuHeight}px`;
      menuIcon.style.minHeight = `${menuHeight}px`;
      // Keep square container matching trigger height
      menuIcon.style.width = width <= 768 ? `${menuHeight}px` : '';
      if (width <= 768) {
        const menuWidth = triggerRect.width;
        let edgeMargin = 15; let gap = 10;
        if (width <= 480) { edgeMargin = 10; gap = 8; }
        if (width <= 360) { edgeMargin = 8; gap = 6; }
        menuIcon.style.right = `${edgeMargin + menuWidth + gap}px`;
        menuIcon.style.padding = '0';
      } else {
        menuIcon.style.right = '';
        menuIcon.style.padding = '';
      }
    }
    window.addEventListener('load', positionRedDot);
    window.addEventListener('resize', positionRedDot);
    window.addEventListener('orientationchange', positionRedDot);
    const mo = new MutationObserver(positionRedDot);
    if (dropdownTrigger) mo.observe(dropdownTrigger, { childList: true, subtree: true, characterData: true });

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => positionRedDot()) : null;
    if (ro && dropdownTrigger) ro.observe(dropdownTrigger);
    const fonts = (document as Document & { fonts?: { ready: Promise<void> } }).fonts;
    if (fonts?.ready) { fonts.ready.then(() => positionRedDot()); }
    const onVis = () => { if (!document.hidden) positionRedDot(); };
    document.addEventListener('visibilitychange', onVis);
    positionRedDot();
    requestAnimationFrame(() => positionRedDot());
    requestAnimationFrame(() => requestAnimationFrame(positionRedDot));

    function startNavDrag(clientX: number, clientY: number) {
      if (!navContainer) return;
      if (window.innerWidth <= 768) return;
      const rect = navContainer.getBoundingClientRect();
      navManuallyMoved = true;
      navContainer.style.position = 'fixed';
      navContainer.style.left = `${rect.left}px`;
      navContainer.style.top = `${rect.top}px`;
      navContainer.style.right = 'auto';
      navContainer.style.bottom = 'auto';
      navContainer.style.transform = 'none';
      const startX = clientX;
      const startY = clientY;
      const baseLeft = rect.left;
      const baseTop = rect.top;
      let isDragging = true;
      const onMove = (mx: number, my: number) => {
        if (!isDragging) return;
        const dx = mx - startX;
        const dy = my - startY;
        navContainer.style.left = `${baseLeft + dx}px`;
        navContainer.style.top = `${baseTop + dy}px`;
      };
      const onMouseMove = (e: MouseEvent) => { if (isDragging) { e.preventDefault(); onMove(e.clientX, e.clientY); } };
      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      const onPointerMove = (e: PointerEvent) => { if (isDragging) { e.preventDefault(); onMove(e.clientX, e.clientY); } };
      const onPointerUpDrag = () => {
        isDragging = false;
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUpDrag);
      };
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUpDrag);
    }

    if (menuIcon) {
      menuIcon.addEventListener('mousedown', (e) => { 
        if (window.innerWidth > 768) {
          e.preventDefault(); 
          startNavDrag(e.clientX, e.clientY); 
        }
      });
      menuIcon.addEventListener('pointerdown', (e) => { 
        if (window.innerWidth > 768 && e.pointerType === 'mouse') {
          e.preventDefault(); 
          startNavDrag(e.clientX, e.clientY); 
        }
      });
    }

    type PopupState = { window: HTMLElement; header: HTMLElement; offset: { x: number; y: number } };
    const popups: Record<string, PopupState> = {
      about: { window: document.getElementById('aboutPopup') as HTMLElement, header: document.getElementById('aboutHeader') as HTMLElement, offset: { x: 0, y: 0 } },
      sponsors: { window: document.getElementById('sponsorsPopup') as HTMLElement, header: document.getElementById('sponsorsHeader') as HTMLElement, offset: { x: 0, y: 0 } },
      contact: { window: document.getElementById('contactPopup') as HTMLElement, header: document.getElementById('contactHeader') as HTMLElement, offset: { x: 0, y: 0 } },
      signup: { window: document.getElementById('signUpPopup') as HTMLElement, header: document.getElementById('signUpHeader') as HTMLElement, offset: { x: 0, y: 0 } },
      wallet: { window: document.getElementById('walletSelectionPopup') as HTMLElement, header: document.querySelector('#walletSelectionPopup .popup-header') as HTMLElement, offset: { x: 0, y: 0 } },
    };

    document.querySelectorAll('.popup-close').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const target = ev.currentTarget as HTMLElement | null;
        const popupId = target?.getAttribute('data-popup');
        if (popupId) {
          document.getElementById(popupId)?.classList.remove('active');
        } else {
          popups.about.window.classList.remove('active');
        }
      });
    });

    function bringToFront(windowElement: HTMLElement) {
      Object.values(popups).forEach(p => { p.window.style.zIndex = '1000'; });
      windowElement.style.zIndex = '1001';
    }
    Object.values(popups).forEach(p => {
      p.window?.addEventListener('mousedown', (event) => { bringToFront(event.currentTarget as HTMLElement); });
    });

    let currentDragging: keyof typeof popups | null = null;
    let dragInitialX = 0, dragInitialY = 0, dragCurrentX = 0, dragCurrentY = 0;
    Object.entries(popups).forEach(([key, popup]) => {
      popup.header?.addEventListener('mousedown', function (e) {
        if ((e.target as HTMLElement).classList.contains('popup-close')) return;
        currentDragging = key as keyof typeof popups;
        dragInitialX = e.clientX - popup.offset.x;
        dragInitialY = e.clientY - popup.offset.y;
        bringToFront(popup.window);
      });
    });
    const onMouseMove = (e: MouseEvent) => {
      if (!currentDragging) return;
      e.preventDefault();
      const popup = popups[currentDragging];
      dragCurrentX = e.clientX - dragInitialX;
      dragCurrentY = e.clientY - dragInitialY;
      popup.offset.x = dragCurrentX;
      popup.offset.y = dragCurrentY;
      popup.window.style.transform = `translate(calc(-50% + ${dragCurrentX}px), calc(-50% + ${dragCurrentY}px))`;
    };
    const onMouseUp = () => { currentDragging = null; };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = item.textContent?.trim();
        if (text === '\\ ABOUT') { popups.about.window.classList.add('active'); bringToFront(popups.about.window); }
        else if (text === '\\ SPONSORS') { popups.sponsors.window.classList.add('active'); bringToFront(popups.sponsors.window); }
        else if (text === '\\ CONTACT') { popups.contact.window.classList.add('active'); bringToFront(popups.contact.window); }
        dropdownItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const mainNav = dropdownTrigger?.querySelector('.nav-item') as HTMLElement | null;
        if (mainNav && mainNav.firstChild) {
          mainNav.firstChild.textContent = `X: \\ OSD \\ ${text?.replace('\\ ','')}`;
        }
      })
    });

    const listenBtn = document.getElementById('listenNow');
    listenBtn?.addEventListener('click', () => {
      const xUrl = 'https://x.com/OSDWTF';
      const twitterAppUrl = 'twitter://user?screen_name=OSDWTF';
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = twitterAppUrl;
        setTimeout(() => window.open(xUrl, '_blank'), 500);
      } else {
        window.open(xUrl, '_blank');
      }
    });

    document.getElementById('signUpBtn')?.addEventListener('click', () => {
      popups.signup.window.classList.add('active');
      bringToFront(popups.signup.window);
    });

    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return emailRegex.test(email);
    };

    const emailInput = document.getElementById('emailInput') as HTMLInputElement | null;
    const emailError = document.getElementById('emailError') as HTMLElement | null;

    emailInput?.addEventListener('blur', () => {
      const email = emailInput.value.trim();
      if (email && !validateEmail(email)) {
        emailInput.style.borderColor = '#ff0000';
        emailInput.style.borderWidth = '2px';
        if (emailError) {
          emailError.textContent = 'Enter valid email';
          emailError.style.display = 'block';
        }
      } else {
        emailInput.style.borderColor = 'rgba(100,100,100,0.3)';
        emailInput.style.borderWidth = '1px';
        if (emailError) {
          emailError.textContent = '';
          emailError.style.display = 'none';
        }
      }
    });

    emailInput?.addEventListener('input', () => {
      const email = emailInput.value.trim();
      if (email && validateEmail(email)) {
        emailInput.style.borderColor = 'rgba(100,100,100,0.3)';
        emailInput.style.borderWidth = '1px';
        if (emailError) {
          emailError.textContent = '';
          emailError.style.display = 'none';
        }
      }
    });

    document.getElementById('emailSubmitBtn')?.addEventListener('click', async () => {
      const input = document.getElementById('emailInput') as HTMLInputElement | null;
      const errorEl = document.getElementById('emailError') as HTMLElement | null;
      const email = input?.value?.trim() || '';
      
      if (!email) {
        if (input) {
          input.style.borderColor = '#ff0000';
          input.style.borderWidth = '2px';
        }
        if (errorEl) {
          errorEl.textContent = 'Enter valid email';
          errorEl.style.display = 'block';
        }
        return;
      }
      
      if (!validateEmail(email)) {
        if (input) {
          input.style.borderColor = '#ff0000';
          input.style.borderWidth = '2px';
        }
        if (errorEl) {
          errorEl.textContent = 'Enter valid email';
          errorEl.style.display = 'block';
        }
        return;
      }
      
      try {
        const res = await fetch('/api/signup/email', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ email }) 
        });
        const data = await res.json();
        
        if (res.ok) {
          if (errorEl) {
            errorEl.textContent = 'Email submitted successfully!';
            errorEl.style.color = '#00ff00';
            errorEl.style.display = 'block';
          }
          if (input) {
            input.value = '';
            input.style.borderColor = 'rgba(100,100,100,0.3)';
            input.style.borderWidth = '1px';
          }
          setTimeout(() => {
            if (errorEl) {
              errorEl.textContent = '';
              errorEl.style.display = 'none';
              errorEl.style.color = '#ff0000';
            }
          }, 3000);
        } else {
          if (errorEl) {
            errorEl.textContent = data?.error || 'Submission failed';
            errorEl.style.display = 'block';
          }
        }
      } catch {
        if (errorEl) {
          errorEl.textContent = 'Network error';
          errorEl.style.display = 'block';
        }
      }
    });

    document.getElementById('xConnectBtn')?.addEventListener('click', async () => {
      // Create a form and submit it to trigger immediate OAuth redirect
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/auth/signin/twitter';
      
      const csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = 'callbackUrl';
      csrfInput.value = '/';
      form.appendChild(csrfInput);
      
      document.body.appendChild(form);
      form.submit();
    });

    const walletPopup = document.getElementById('walletSelectionPopup');
    const walletError = document.getElementById('walletError') as HTMLElement | null;

    const checkWalletInstalled = () => {
      const unisatBtn = document.getElementById('unisatBtn') as HTMLElement | null;
      const xverseBtn = document.getElementById('xverseBtn') as HTMLElement | null;
      const okxBtn = document.getElementById('okxBtn') as HTMLElement | null;

      const hasUnisat = typeof (window as Window & { unisat?: unknown }).unisat !== 'undefined';
      const hasXverse = typeof (window as Window & { XverseProviders?: unknown; BitcoinProvider?: unknown }).XverseProviders !== 'undefined' || typeof (window as Window & { BitcoinProvider?: unknown }).BitcoinProvider !== 'undefined';
      const hasOkx = typeof (window as Window & { okxwallet?: { bitcoin?: unknown } }).okxwallet?.bitcoin !== 'undefined';

      if (unisatBtn) {
        if (!hasUnisat) {
          unisatBtn.style.borderColor = '#ff0000';
          unisatBtn.style.color = '#ff0000';
          unisatBtn.style.opacity = '0.7';
        } else {
          unisatBtn.style.borderColor = '#F7931A';
          unisatBtn.style.color = '#fff';
          unisatBtn.style.opacity = '1';
        }
      }

      if (xverseBtn) {
        if (!hasXverse) {
          xverseBtn.style.borderColor = '#ff0000';
          xverseBtn.style.color = '#ff0000';
          xverseBtn.style.opacity = '0.7';
        } else {
          xverseBtn.style.borderColor = '#F7931A';
          xverseBtn.style.color = '#fff';
          xverseBtn.style.opacity = '1';
        }
      }

      if (okxBtn) {
        if (!hasOkx) {
          okxBtn.style.borderColor = '#ff0000';
          okxBtn.style.color = '#ff0000';
          okxBtn.style.opacity = '0.7';
        } else {
          okxBtn.style.borderColor = '#F7931A';
          okxBtn.style.color = '#fff';
          okxBtn.style.opacity = '1';
        }
      }
    };

    document.getElementById('walletConnectBtn')?.addEventListener('click', () => {
      if (walletPopup) {
        walletPopup.classList.add('active');
        bringToFront(walletPopup);
        checkWalletInstalled();
      }
    });

    document.getElementById('walletClose')?.addEventListener('click', () => {
      walletPopup?.classList.remove('active');
    });

    const connectWallet = async (walletType: 'unisat' | 'xverse' | 'okx') => {
      try {
        if (walletError) {
          walletError.textContent = 'Connecting...';
          walletError.style.color = '#F7931A';
          walletError.style.display = 'block';
        }

        let address = '';
        let pubkey = '';

        if (walletType === 'unisat') {
          const unisat = (window as Window & { unisat?: { requestAccounts: () => Promise<string[]>; getPublicKey: () => Promise<string> } }).unisat;
          if (!unisat) {
            window.open('https://unisat.io/download', '_blank');
            if (walletError) {
              walletError.textContent = 'Opening Unisat installation page...';
              walletError.style.color = '#F7931A';
              walletError.style.display = 'block';
            }
            return;
          }
          const accounts = await unisat.requestAccounts();
          address = accounts[0];
          try {
            pubkey = await unisat.getPublicKey();
          } catch {
            console.warn('Could not get pubkey from Unisat');
          }
        } else if (walletType === 'xverse') {
          const hasXverse = typeof (window as Window & { XverseProviders?: unknown; BitcoinProvider?: unknown }).XverseProviders !== 'undefined' || typeof (window as Window & { BitcoinProvider?: unknown }).BitcoinProvider !== 'undefined';
          if (!hasXverse) {
            window.open('https://www.xverse.app/download', '_blank');
            if (walletError) {
              walletError.textContent = 'Opening Xverse installation page...';
              walletError.style.color = '#F7931A';
              walletError.style.display = 'block';
            }
            return;
          }
          await new Promise((resolve, reject) => {
            getAddress({
              payload: {
                purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
                message: 'Connect to OSD.WTF',
                network: {
                  type: BitcoinNetworkType.Mainnet
                }
              },
              onFinish: (response: { addresses: Array<{ purpose: string; address: string; publicKey?: string }> }) => {
                const ordinalsAddress = response.addresses.find((addr) => addr.purpose === AddressPurpose.Ordinals);
                address = ordinalsAddress?.address || response.addresses[0]?.address || '';
                pubkey = ordinalsAddress?.publicKey || response.addresses[0]?.publicKey || '';
                resolve(true);
              },
              onCancel: () => {
                reject(new Error('User cancelled'));
              }
            });
          });
        } else if (walletType === 'okx') {
          const okxwallet = (window as Window & { okxwallet?: { bitcoin?: { requestAccounts: () => Promise<string[]>; getPublicKey: () => Promise<string> } } }).okxwallet?.bitcoin;
          if (!okxwallet) {
            window.open('https://www.okx.com/web3', '_blank');
            if (walletError) {
              walletError.textContent = 'Opening OKX Wallet installation page...';
              walletError.style.color = '#F7931A';
              walletError.style.display = 'block';
            }
            return;
          }
          const accounts = await okxwallet.requestAccounts();
          address = accounts[0];
          try {
            pubkey = await okxwallet.getPublicKey();
          } catch {
            console.warn('Could not get pubkey from OKX');
          }
        }

        if (!address) {
          throw new Error('No address received');
        }

        const res = await fetch('/api/wallet/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, pubkey }),
        });

        const data = await res.json();

        if (res.ok) {
          if (walletError) {
            walletError.textContent = 'Wallet connected successfully!';
            walletError.style.color = '#00ff00';
            walletError.style.display = 'block';
          }
          setTimeout(() => {
            walletPopup?.classList.remove('active');
            if (walletError) {
              walletError.textContent = '';
              walletError.style.display = 'none';
              walletError.style.color = '#ff0000';
            }
          }, 2000);
        } else {
          throw new Error(data?.error || 'Connection failed');
        }
      } catch (err: unknown) {
        console.error('Wallet connection error:', err);
        if (walletError) {
          const error = err as { message?: string };
          walletError.textContent = error.message || 'Connection failed';
          walletError.style.color = '#ff0000';
          walletError.style.display = 'block';
        }
      }
    };

    document.getElementById('unisatBtn')?.addEventListener('click', () => connectWallet('unisat'));
    document.getElementById('xverseBtn')?.addEventListener('click', () => connectWallet('xverse'));
    document.getElementById('okxBtn')?.addEventListener('click', () => connectWallet('okx'));

    return () => {
      // Remove homepage class on cleanup
      document.body.classList.remove('homepage');
      
      document.removeEventListener('click', closeOnOutside);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      clearInterval(dtInterval);
      mo.disconnect();
      ro?.disconnect();
      window.removeEventListener('orientationchange', positionRedDot);
      document.removeEventListener('visibilitychange', onVis);
      if (menuIcon) {
        menuIcon.replaceWith(menuIcon.cloneNode(true));
      }
      if (navContainer) {
        navContainer.replaceWith(navContainer.cloneNode(true));
      }
    };
  }, []);

  return (
    <>
      <div className="nav-container">
        <div className="menu-icon">
          <div className="recording-dot"></div>
        </div>

        <div className="dropdown-trigger" id="dropdownTrigger">
          <div className="nav-item">
            X: \ OSD \ WTF
            <span className="dropdown-arrow">▼</span>
          </div>
          <div className="dropdown-menu" id="dropdownMenu">
            <div className="dropdown-item active">\ WTF</div>
            <div className="dropdown-item">\ ABOUT</div>
            <div className="dropdown-item">\ SPONSORS</div>
            <div className="dropdown-item">\ CONTACT</div>
          </div>
        </div>

        <div className="nav-item secondary">UNCUT_UNFILTERED_RAW_OSD.WTF</div>
        <div className="nav-item tertiary" id="listenNow">LISTEN NOW</div>
        <div className="nav-item quaternary" id="signUpBtn">SIGN UP</div>
        <div className="nav-item quinary" id="datetime"></div>
      </div>

      <footer className="site-footer">
        <nav className="legal-nav">
          <Link href="/legal">Legal</Link>
          <span className="sep">•</span>
          <Link href="/terms">Terms of Use</Link>
          <span className="sep">•</span>
          <Link href="/privacy">Privacy Policy</Link>
          <span className="sep">•</span>
          <Link href="/recording-policy">Recording & Clip Policy</Link>
        </nav>
        <small>© OSD.WTF — Educational only. No financial advice.</small>
      </footer>

      {/* About Popup */}
      <div className="popup-window" id="aboutPopup">
        <div className="popup-header" id="aboutHeader">
          <div className="popup-title">ABOUT.TXT</div>
          <button className="popup-close" id="popupClose">X CLOSE</button>
        </div>
        <div className="popup-content">
          <div className="popup-line"><span className="popup-line-number">001</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">002</span><span className="popup-line-content"><strong>■ ABOUT OSD</strong></span></div>
          <div className="popup-line"><span className="popup-line-number">003</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">004</span><span className="popup-line-content">OSD, the Ordinals Support Desk, is a pioneering community platform</span></div>
          <div className="popup-line"><span className="popup-line-number">005</span><span className="popup-line-content">that originated on Twitter/X Spaces with a mission to democratize</span></div>
          <div className="popup-line"><span className="popup-line-number">006</span><span className="popup-line-content">knowledge about Bitcoin Ordinals.</span></div>
          <div className="popup-line"><span className="popup-line-number">007</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">008</span><span className="popup-line-content">Founded as a 24/7 live audio space, OSD quickly evolved into the</span></div>
          <div className="popup-line"><span className="popup-line-number">009</span><span className="popup-line-content">premier destination for anyone interested in learning about Ordinals—</span></div>
          <div className="popup-line"><span className="popup-line-number">010</span><span className="popup-line-content">a revolutionary protocol built on Bitcoin that enables on-chain</span></div>
          <div className="popup-line"><span className="popup-line-number">011</span><span className="popup-line-content">digital artifacts through the inscription of data directly onto</span></div>
          <div className="popup-line"><span className="popup-line-number">012</span><span className="popup-line-content">satoshis.</span></div>
        </div>
      </div>

      {/* Sponsors Popup */}
      <div className="popup-window" id="sponsorsPopup">
        <div className="popup-header" id="sponsorsHeader">
          <div className="popup-title">SPONSORS.TXT</div>
          <button className="popup-close" data-popup="sponsorsPopup">X CLOSE</button>
        </div>
        <div className="popup-content">
          <div className="popup-line"><span className="popup-line-number">001</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">002</span><span className="popup-line-content"><strong>■ BECOME A SPONSOR</strong></span></div>
          <div className="popup-line"><span className="popup-line-number">003</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">004</span><span className="popup-line-content">OSD.WTF is powered by community support and strategic partnerships.</span></div>
          <div className="popup-line"><span className="popup-line-number">005</span><span className="popup-line-content">We work with brands, protocols, and creators who align with our mission</span></div>
          <div className="popup-line"><span className="popup-line-number">006</span><span className="popup-line-content">to educate and support the Bitcoin Ordinals ecosystem.</span></div>
          <div className="popup-line"><span className="popup-line-number">007</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">008</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">009</span><span className="popup-line-content"><strong>■ SPONSORSHIP OPPORTUNITIES</strong></span></div>
          <div className="popup-line"><span className="popup-line-number">010</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">011</span><span className="popup-line-content">• Live Space mentions and shoutouts</span></div>
          <div className="popup-line"><span className="popup-line-number">012</span><span className="popup-line-content">• Website and social media placement</span></div>
          <div className="popup-line"><span className="popup-line-number">013</span><span className="popup-line-content">• Dedicated segments and interviews</span></div>
          <div className="popup-line"><span className="popup-line-number">014</span><span className="popup-line-content">• Custom partnership packages</span></div>
          <div className="popup-line"><span className="popup-line-number">015</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">016</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">017</span><span className="popup-line-content"><strong>■ GET IN TOUCH</strong></span></div>
          <div className="popup-line"><span className="popup-line-number">018</span><span className="popup-line-content">Email: SPONSORS@OSD.WTF</span></div>
          <div className="popup-line"><span className="popup-line-number">019</span><span className="popup-line-content">X (Twitter): @OSDWTF</span></div>
        </div>
      </div>

      {/* Contact Popup */}
      <div className="popup-window" id="contactPopup">
        <div className="popup-header" id="contactHeader">
          <div className="popup-title">CONTACT.TXT</div>
          <button className="popup-close" data-popup="contactPopup">X CLOSE</button>
        </div>
        <div className="popup-content">
          <div className="popup-line"><span className="popup-line-number">001</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">002</span><span className="popup-line-content"><strong>■ GET IN TOUCH</strong></span></div>
          <div className="popup-line"><span className="popup-line-number">003</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">004</span><span className="popup-line-content">Have questions, feedback, or want to collaborate?</span></div>
          <div className="popup-line"><span className="popup-line-number">005</span><span className="popup-line-content">Reach out to the OSD.WTF team.</span></div>
          <div className="popup-line"><span className="popup-line-number">006</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">007</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">008</span><span className="popup-line-content"><strong>■ GENERAL INQUIRIES</strong></span></div>
          <div className="popup-line"><span className="popup-line-number">009</span><span className="popup-line-content">Email: CONTACT@OSD.WTF</span></div>
          <div className="popup-line"><span className="popup-line-number">010</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">011</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">012</span><span className="popup-line-content"><strong>■ SOCIAL MEDIA</strong></span></div>
          <div className="popup-line"><span className="popup-line-number">013</span><span className="popup-line-content">X (Twitter): @OSDWTF</span></div>
          <div className="popup-line"><span className="popup-line-number">014</span><span className="popup-line-content">Join our live Spaces 24/7</span></div>
          <div className="popup-line"><span className="popup-line-number">015</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">016</span><span className="popup-line-content"></span></div>
          <div className="popup-line"><span className="popup-line-number">017</span><span className="popup-line-content"><strong>■ SPONSORSHIPS</strong></span></div>
          <div className="popup-line"><span className="popup-line-number">018</span><span className="popup-line-content">Email: SPONSORS@OSD.WTF</span></div>
        </div>
      </div>

      {/* Wallet Selection Popup */}
      <div className="popup-window" id="walletSelectionPopup">
        <div className="popup-header">
          <div className="popup-title">SELECT_WALLET.TXT</div>
          <button className="popup-close" id="walletClose">X CLOSE</button>
        </div>
        <div className="popup-content" style={{ padding: 30, background: 'rgba(0,0,0,0.5)' }}>
          <h3 style={{ color: '#F7931A', marginBottom: 20, fontSize: 14, fontWeight: 'bold' }}>■ CHOOSE YOUR WALLET</h3>
          <button id="unisatBtn" style={{
            width: '100%', padding: 15, marginBottom: 12, background: 'rgba(0,0,0,0.7)', border: '1px solid #F7931A', color: '#fff', fontFamily: 'Courier New, monospace', fontSize: 13, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}>
            <span style={{ fontSize: 20 }}>🦄</span> UNISAT WALLET
          </button>
          <button id="xverseBtn" style={{
            width: '100%', padding: 15, marginBottom: 12, background: 'rgba(0,0,0,0.7)', border: '1px solid #F7931A', color: '#fff', fontFamily: 'Courier New, monospace', fontSize: 13, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}>
            <span style={{ fontSize: 20 }}>⚡</span> XVERSE WALLET
          </button>
          <button id="okxBtn" style={{
            width: '100%', padding: 15, marginBottom: 12, background: 'rgba(0,0,0,0.7)', border: '1px solid #F7931A', color: '#fff', fontFamily: 'Courier New, monospace', fontSize: 13, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}>
            <span style={{ fontSize: 20 }}>🌐</span> OKX WALLET
          </button>
          <div id="walletError" style={{
            color: '#ff0000', fontSize: 11, fontFamily: 'Courier New, monospace', display: 'none', marginTop: 15, textAlign: 'center'
          }}></div>
          <p style={{ marginTop: 20, fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontStyle: 'italic' }}>
            Connect your Bitcoin wallet to access exclusive features and content.
          </p>
          <p style={{ marginTop: 10, fontSize: 9, color: '#ff0000', textAlign: 'center', fontStyle: 'italic' }}>
            Red buttons = not installed. Click to open installation page.
          </p>
        </div>
      </div>

      {/* Sign Up Popup */}
      <div className="popup-window" id="signUpPopup">
        <div className="popup-header" id="signUpHeader">
          <div className="popup-title">SIGN_UP.TXT</div>
          <button className="popup-close" data-popup="signUpPopup">X CLOSE</button>
        </div>
        <div className="popup-content" style={{ padding: 30, background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ color: '#F7931A', marginBottom: 15, fontSize: 14, fontWeight: 'bold' }}>■ EMAIL SIGN UP</h3>
            <input type="email" id="emailInput" placeholder="your@email.com" style={{
              width: '100%', padding: 12, background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(100,100,100,0.3)', color: '#fff', fontFamily: 'Courier New, monospace', fontSize: 12, marginBottom: 10, outline: 'none', transition: 'border-color 0.2s'
            }} />
            <button id="emailSubmitBtn" style={{
              width: '100%', padding: 12, background: 'rgba(0,0,0,0.7)', border: '1px solid #F7931A', color: '#F7931A', fontFamily: 'Courier New, monospace', fontSize: 12, fontWeight: 'bold', cursor: 'pointer', marginBottom: 5
            }}>SUBMIT EMAIL</button>
            <div id="emailError" style={{
              color: '#ff0000', fontSize: 11, fontFamily: 'Courier New, monospace', display: 'none', marginTop: 5
            }}></div>
          </div>
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ color: '#F7931A', marginBottom: 15, fontSize: 14, fontWeight: 'bold' }}>■ WALLET CONNECT</h3>
            <button id="walletConnectBtn" style={{
              width: '100%', padding: 12, background: 'rgba(0,0,0,0.7)', border: '1px solid #F7931A', color: '#F7931A', fontFamily: 'Courier New, monospace', fontSize: 12, fontWeight: 'bold', cursor: 'pointer'
            }}>🔗 CONNECT WALLET</button>
          </div>
          <div>
            <h3 style={{ color: '#F7931A', marginBottom: 15, fontSize: 14, fontWeight: 'bold' }}>■ X (TWITTER) CONNECT</h3>
            <button id="xConnectBtn" style={{
              width: '100%', padding: 12, background: 'rgba(0,0,0,0.7)', border: '1px solid #F7931A', color: '#F7931A', fontFamily: 'Courier New, monospace', fontSize: 12, fontWeight: 'bold', cursor: 'pointer'
            }}>🕊 CONNECT WITH X</button>
          </div>
          <p style={{ marginTop: 20, fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontStyle: 'italic' }}>
            Choose your preferred sign-up method. All options keep you connected to OSD.WTF updates.
          </p>
        </div>
      </div>
    </>
  );
}
