import java.util.*;

class Patient {
    String name;
    int urgencyScore; // 1-10 priority scale
    String requiredResource;

    public Patient(String name, int urgencyScore, String requiredResource) {
        this.name = name;
        this.urgencyScore = urgencyScore;
        this.requiredResource = requiredResource;
    }
}

class Bed {
    String bedId;
    String wardType; // ICU, GENERAL
    boolean hasVentilator;
    boolean isOccupied;
    String patientName;

    public Bed(String bedId, String wardType, boolean hasVentilator) {
        this.bedId = bedId;
        this.wardType = wardType;
        this.hasVentilator = hasVentilator;
        this.isOccupied = false;
        this.patientName = null;
    }
}

public class HospitalManager {

    // O(1) Instant bed lookup by ID using HashMap
    private Map<String, Bed> bedInventory = new HashMap<>();

    // High Priority Allocation Queue using Max-Heap PriorityQueue
    private PriorityQueue<Patient> waitlist = new PriorityQueue<>(
        (a, b) -> Integer.compare(b.urgencyScore, a.urgencyScore)
    );

    public void addBed(Bed bed) {
        bedInventory.put(bed.bedId, bed);
    }

    public void allocate(Patient patient) {
        Bed availableBed = null;

        for (Bed bed : bedInventory.values()) {
            if (!bed.isOccupied && bed.wardType.equalsIgnoreCase(patient.requiredResource)) {
                availableBed = bed;
                break;
            }
        }

        if (availableBed != null) {
            availableBed.isOccupied = true;
            availableBed.patientName = patient.name;
            System.out.println("Allocated Bed " + availableBed.bedId + " to " + patient.name);
        } else {
            waitlist.add(patient);
            System.out.println("Beds full. Patient " + patient.name + " added to Priority Queue (Score: " + patient.urgencyScore + ")");
        }
    }

    public void releaseBed(String bedId) {
        Bed bed = bedInventory.get(bedId);
        if (bed == null || !bed.isOccupied) return;

        System.out.println("Releasing Bed " + bedId + " from " + bed.patientName);
        bed.isOccupied = false;
        bed.patientName = null;

        // Process highest urgency patient from priority queue
        if (!waitlist.isEmpty()) {
            Patient nextPatient = waitlist.poll();
            allocate(nextPatient);
        }
    }

    public static void main(String[] args) {
        HospitalManager manager = new HospitalManager();
        
        // Initialize Inventory
        manager.addBed(new Bed("ICU-101", "ICU", true));
        manager.addBed(new Bed("GEN-201", "GENERAL", false));

        // Triage Operations
        manager.allocate(new Patient("Alice", 9, "ICU"));
        manager.allocate(new Patient("Bob", 10, "ICU")); // Goes to waitlist
        
        manager.releaseBed("ICU-101"); // Auto-allocates to Bob due to higher priority
    }
}
