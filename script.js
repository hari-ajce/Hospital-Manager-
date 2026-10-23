if (!bed || bed.ward !== request.from) {
      alert("The bed's ward has changed. Review this transfer request.");
      return;
    }

    if (bed.status === "Cleaning") {
      alert("A bed under cleaning cannot be transferred in this demo.");
      return;
    }

    const destinationOccupied = beds.some(
      other => other.ward === request.to &&
        other.status === "Occupied" &&
        other.id !== bed.id
    );

    if (destinationOccupied) {
      alert("The destination ward has occupied beds. Check local capacity before proceeding.");
      return;
    }

    bed.ward = request.to;
    recentBeds.record(bed.id, bed.status);
  }

  request.status = status;
  renderTransfers();
  renderDashboard();
}

// ----------------------------------------------
// RECENT BED ACTIVITY
// ----------------------------------------------

function renderRecentBeds() {
  const container = $("recentBeds");
  container.replaceChildren();

  const recent = recentBeds.getRecent();

  if (recent.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No bed activity recorded in this session.";
    container.appendChild(empty);
    return;
  }

  recent.forEach(node => {
    const item = document.createElement("div");
    item.className = "recent-item";

    const title = document.createElement("strong");
    title.textContent = Bed ${node.key};

    const detail = document.createElement("small");
    detail.textContent =
      ${node.status} · ${node.updatedAt.toLocaleTimeString()};

    item.append(title, detail);
    container.appendChild(item);
  });
}

// ----------------------------------------------
// HELPERS AND INITIALIZATION
// ----------------------------------------------

function closeDialog(id) {
  $(id).close();
}

renderDashboard();
renderInventory();
renderTransfers();
