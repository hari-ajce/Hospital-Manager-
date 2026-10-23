// UI Rendering
function renderUI() {
    const wardGrid = document.getElementById('ward-grid');
    wardGrid.innerHTML = '';

    let totalBeds = bedHashMap.size;
    let occupiedICU = 0;
    let totalICU = 0;
    let freeVentilators = 0;
    let freeBeds = 0;

    wards.forEach(ward => {
        const wardCard = document.createElement('div');
        wardCard.className = 'ward-card';
        
        let bedsHTML = '';
        ward.beds.forEach(bedId => {
            const bed = bedHashMap.get(bedId);
            
            if (bed.type === 'ICU') {
                totalICU++;
                if (bed.isOccupied) occupiedICU++;
                if (!bed.isOccupied && bed.hasVentilator) freeVentilators++;
            }
            if (!bed.isOccupied) freeBeds++;

            bedsHTML += 
                <div class="bed-item ${bed.isOccupied ? 'occupied' : 'available'}">
                    <strong>${bed.id}</strong>
                    <span>${bed.isOccupied ? '👤 ' + bed.patientName : '🟢 Available'}</span>
                    <span>${bed.hasVentilator ? '🫁 Vent' : ''}</span>
                    ${bed.isOccupied ? <button class="bed-action release" onclick="releaseBed('${bed.id}')">Release</button> : ''}
                </div>
            ;
        });

        wardCard.innerHTML = 
            <div class="ward-header">
                <h3>${ward.name}</h3>
                <small>${ward.type}</small>
            </div>
            <div class="bed-list">${bedsHTML}</div>
        ;
        wardGrid.appendChild(wardCard);
    });

    // Update Stats Navbar
    document.getElementById('icu-occupancy').innerText = totalICU > 0 ? ${Math.round((occupiedICU / totalICU) * 100)}% : '0%';
    document.getElementById('vent-free').innerText = freeVentilators;
    document.getElementById('total-free').innerText = freeBeds;

    // Render Waitlist
    const waitlistUI = document.getElementById('waitlist-ui');
    const queueList = waitlistQueue.toArray();
    if (queueList.length === 0) {
        waitlistUI.innerHTML = '<li class="empty-state">No patients currently in queue</li>';
    } else {
        waitlistUI.innerHTML = queueList.map(p => 
            <li>
                <strong>${p.name}</strong> - Priority Score: <span style="color:red">${p.urgency}</span>
                <br><small>Requires: ${p.requiredType}</small>
            </li>
        ).join('');
    }
}

// Form Handlers
document.getElementById('allocate-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('patient-name').value;
    const urgency = parseInt(document.getElementById('urgency-score').value);
    const type = document.getElementById('resource-type').value;

    allocateResource(name, urgency, type);
    document.getElementById('patient-name').value = '';
});

// Initialize on Load
initDataStructures();
