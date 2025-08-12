console.log('Testing packages.json loading...'); fetch('js/packages.json').then(r => r.json()).then(p => console.log('Loaded', p.length, 'packages')).catch(e => console.error('Error:', e));
