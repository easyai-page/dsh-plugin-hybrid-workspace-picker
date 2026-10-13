window.__ModuleLoader__.load({
  id: 'dsh-plugin-hybrid-workspace-picker',
  factory(require) {
    const React = require('react');
    const { useState, useEffect, useRef } = React;
    const h = React.createElement;

    const LOCALE_NS = 'hybrid-directory-picker';

    function HybridDirectoryDialog(props) {
      const { open, busy, onPicked, onCancel, pickNative, listDirectory, t } = props;
      const [path, setPath] = useState('');
      const [pickingNative, setPickingNative] = useState(false);
      const [errorMessage, setErrorMessage] = useState(null);
      const [treeViewOpen, setTreeViewOpen] = useState(false);
      const [listingLoading, setListingLoading] = useState(false);
      const [currentListing, setCurrentListing] = useState(null);
      const inputRef = useRef(null);
      const aliveRef = useRef(true);

      useEffect(() => {
        aliveRef.current = true;
        return () => { aliveRef.current = false; };
      }, []);

      useEffect(() => {
        if (open) {
          setPath('');
          setErrorMessage(null);
          setPickingNative(false);
          setTreeViewOpen(false);
          setCurrentListing(null);
          setListingLoading(false);
          const timer = setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
          }, 50);
          return () => clearTimeout(timer);
        }
      }, [open]);

      if (!open) return null;

      const isProcessing = busy || pickingNative || listingLoading;

      const handleConfirm = () => {
        if (isProcessing) return;
        const trimmed = path.trim();
        if (trimmed) {
          onPicked(trimmed);
        }
      };

      const loadDirectoryListing = (targetPath) => {
        setListingLoading(true);
        setErrorMessage(null);
        listDirectory(targetPath || undefined).then(
          (listing) => {
            if (!aliveRef.current) return;
            setListingLoading(false);
            setCurrentListing(listing);
            setTreeViewOpen(true);
            if (listing && listing.path) {
              setPath(listing.path);
            }
          },
          (err) => {
            if (!aliveRef.current) return;
            setListingLoading(false);
            const msg = err instanceof Error && err.message ? err.message : t('dialog.listFailed');
            setErrorMessage(msg);
          }
        );
      };

      const handleBrowseNative = () => {
        if (isProcessing) return;
        setPickingNative(true);
        setErrorMessage(null);

        Promise.resolve().then(() => pickNative()).then(
          (selectedPath) => {
            if (!aliveRef.current) return;
            setPickingNative(false);
            if (selectedPath !== null && selectedPath !== undefined && String(selectedPath).trim() !== '') {
              const finalPath = String(selectedPath).trim();
              setPath(finalPath);
              onPicked(finalPath);
            }
          },
          (err) => {
            if (!aliveRef.current) return;
            setPickingNative(false);
            // 原生窗口不可用时，自动优雅降级展开网页内目录树
            loadDirectoryListing(path.trim() || undefined);
          }
        );
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleConfirm();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          if (!isProcessing) onCancel();
        }
      };

      return h('div', {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': t('dialog.title'),
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(2px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        },
        onMouseDown: (e) => {
          if (e.target === e.currentTarget && !isProcessing) {
            onCancel();
          }
        }
      }, h('div', {
        style: {
          backgroundColor: 'var(--dsw-alias-bg-overlay)',
          color: 'var(--dsw-alias-label-primary)',
          border: '1px solid var(--dsw-alias-border-l1)',
          borderRadius: '12px',
          padding: '20px 24px',
          width: '520px',
          maxWidth: 'calc(100vw - 32px)',
          boxSizing: 'border-box',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
        }
      }, [
        h('div', {
          key: 'header',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }
        }, [
          h('h3', {
            key: 'title',
            style: {
              margin: 0,
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--dsw-alias-label-primary)',
            }
          }, t('dialog.title')),
        ]),
        h('p', {
          key: 'hint',
          style: {
            margin: '0 0 16px 0',
            fontSize: '13px',
            lineHeight: '1.5',
            color: 'var(--dsw-alias-label-secondary)',
          }
        }, t('dialog.hint')),
        h('div', {
          key: 'input-row',
          style: {
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            marginBottom: '12px',
          }
        }, [
          h('input', {
            key: 'input',
            ref: inputRef,
            type: 'text',
            placeholder: t('dialog.placeholder'),
            value: path,
            disabled: isProcessing,
            onChange: (e) => {
              setPath(e.target.value);
              if (errorMessage) setErrorMessage(null);
            },
            onKeyDown: handleKeyDown,
            style: {
              flex: 1,
              minWidth: 0,
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--dsw-alias-border-l2)',
              backgroundColor: 'var(--dsw-alias-bg-layer-1)',
              color: 'var(--dsw-alias-label-primary)',
              outline: 'none',
              fontSize: '13px',
              lineHeight: '20px',
              boxSizing: 'border-box',
            }
          }),
          h('button', {
            key: 'browse-btn',
            type: 'button',
            onClick: handleBrowseNative,
            disabled: isProcessing,
            style: {
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--dsw-alias-border-l2)',
              backgroundColor: 'var(--dsw-alias-bg-layer-2)',
              color: 'var(--dsw-alias-label-primary)',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              lineHeight: '20px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              opacity: isProcessing ? 0.6 : 1,
            }
          }, pickingNative ? t('dialog.browsing') : t('dialog.browse')),
        ]),

        // 远程环境或手动展开的文件树
        treeViewOpen && currentListing && h('div', {
          key: 'tree-container',
          style: {
            margin: '0 0 12px 0',
            border: '1px solid var(--dsw-alias-border-l1)',
            borderRadius: '8px',
            backgroundColor: 'var(--dsw-alias-bg-layer-1)',
            padding: '10px 12px',
            fontSize: '12px',
            maxHeight: '180px',
            overflowY: 'auto',
          }
        }, [
          h('div', {
            key: 'tree-crumbs',
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              alignItems: 'center',
              marginBottom: '8px',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--dsw-alias-border-l1)',
              color: 'var(--dsw-alias-label-secondary)',
            }
          }, currentListing.crumbs.map((crumb, idx) =>
            h('span', { key: crumb.path + idx, style: { display: 'inline-flex', alignItems: 'center', gap: '4px' } }, [
              h('button', {
                type: 'button',
                onClick: () => loadDirectoryListing(crumb.path),
                style: {
                  background: 'none',
                  border: 'none',
                  color: 'var(--dsw-alias-brand-primary)',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  textDecoration: 'none',
                }
              }, crumb.name || '/'),
              idx < currentListing.crumbs.length - 1 ? h('span', { style: { opacity: 0.5 } }, '/') : null
            ])
          )),
          h('div', {
            key: 'tree-items',
            style: { display: 'flex', flexDirection: 'column', gap: '2px' }
          }, currentListing.entries.length === 0
            ? h('div', { style: { color: 'var(--dsw-alias-label-secondary)', padding: '6px 0' } }, t('dialog.emptyDirectory'))
            : currentListing.entries.filter(e => !e.hidden).map(entry =>
              h('button', {
                key: entry.path,
                type: 'button',
                onClick: () => loadDirectoryListing(entry.path),
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  color: 'var(--dsw-alias-label-primary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  hover: { backgroundColor: 'var(--dsw-alias-bg-layer-2)' },
                },
                onMouseEnter: (e) => { e.currentTarget.style.backgroundColor = 'var(--dsw-alias-bg-layer-2)'; },
                onMouseLeave: (e) => { e.currentTarget.style.backgroundColor = 'transparent'; }
              }, [
                h('span', { key: 'icon', style: { color: 'var(--dsw-alias-brand-primary)' } }, '📁'),
                h('span', { key: 'name', style: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, entry.name)
              ])
            )
          )
        ]),

        errorMessage ? h('div', {
          key: 'error',
          role: 'alert',
          style: {
            color: 'var(--dsw-alias-state-error-primary)',
            fontSize: '12px',
            lineHeight: '1.4',
            marginBottom: '12px',
          }
        }, errorMessage) : null,

        h('div', {
          key: 'footer',
          style: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '4px',
          }
        }, [
          h('button', {
            key: 'cancel-btn',
            type: 'button',
            onClick: onCancel,
            disabled: isProcessing,
            style: {
              padding: '7px 16px',
              borderRadius: '8px',
              border: '1px solid var(--dsw-alias-border-l1)',
              backgroundColor: 'transparent',
              color: 'var(--dsw-alias-label-primary)',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              lineHeight: '20px',
              opacity: isProcessing ? 0.6 : 1,
            }
          }, t('dialog.cancel')),
          h('button', {
            key: 'confirm-btn',
            type: 'button',
            onClick: handleConfirm,
            disabled: isProcessing || !path.trim(),
            style: {
              padding: '7px 16px',
              borderRadius: '8px',
              border: '1px solid transparent',
              backgroundColor: 'var(--dsw-alias-brand-primary)',
              color: '#ffffff',
              cursor: (isProcessing || !path.trim()) ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              lineHeight: '20px',
              fontWeight: 500,
              opacity: (isProcessing || !path.trim()) ? 0.5 : 1,
            }
          }, busy ? t('dialog.creating') : t('dialog.confirm')),
        ]),
      ]));
    }

    return {
      inject: ['slots', 'uiWorkspace', 'locale'],
      apply(ctx) {
        ctx.effect(() => {
          const disposers = [];
          const dictionaries = [
            ['zh', {
              'dialog.title': '添加工作区目录',
              'dialog.hint': '可直接输入或粘贴目录路径，或点击右侧「浏览…」选择文件夹。',
              'dialog.placeholder': '请输入绝对路径，例如: /home/user/project',
              'dialog.browse': '浏览…',
              'dialog.browsing': '正在选择…',
              'dialog.cancel': '取消',
              'dialog.confirm': '确认',
              'dialog.creating': '正在创建…',
              'dialog.browseFailed': '无法打开本地文件管理器，已展开目录浏览',
              'dialog.listFailed': '读取目录失败',
              'dialog.emptyDirectory': '此目录下无子文件夹',
            }],
            ['en', {
              'dialog.title': 'Add Workspace Directory',
              'dialog.hint': 'Enter or paste a directory path directly, or click "Browse…" to select a folder.',
              'dialog.placeholder': 'Enter absolute path, e.g. /home/user/project',
              'dialog.browse': 'Browse…',
              'dialog.browsing': 'Selecting…',
              'dialog.cancel': 'Cancel',
              'dialog.confirm': 'Confirm',
              'dialog.creating': 'Creating…',
              'dialog.browseFailed': 'Unable to open file manager, directory tree expanded',
              'dialog.listFailed': 'Failed to list directory',
              'dialog.emptyDirectory': 'No child folders in this directory',
            }],
          ];
          try {
            for (const [locale, dict] of dictionaries) {
              disposers.push(ctx.locale.register(LOCALE_NS, locale, dict));
            }
          } catch (error) {
            for (const dispose of disposers.reverse()) dispose();
            throw error;
          }
          return () => {
            for (const dispose of disposers) dispose();
          };
        }, 'hybrid-workspace-picker: locale dictionaries');

        const desktop = globalThis.__DSH_DIRECTORY_PICKER__;
        const pickNative = desktop !== undefined && typeof desktop.pick === 'function'
          ? () => desktop.pick()
          : () => ctx.uiWorkspace.pickDirectory();

        const injected = () => ({
          pickNative,
          listDirectory: (p, signal) => ctx.uiWorkspace.listDirectory(p, signal),
          t: ctx.locale.bind(LOCALE_NS),
        });

        ctx.slots.inject('conversation.hero.workspace.directoryFlow', () =>
          ctx.slots.inject('sidebar.workspaces.directoryFlow', function* () {
            yield ctx.slots.register({
              name: 'conversation.hero.workspace.directoryFlow',
              priority: -10,
              inject: injected,
            }, HybridDirectoryDialog);
            yield ctx.slots.register({
              name: 'sidebar.workspaces.directoryFlow',
              priority: -10,
              inject: injected,
            }, HybridDirectoryDialog);
          })
        );
      }
    };
  },
});
