// Advanced Fault Detection Simulator
const faultTypes = {
    'break': {
        name: "Fiber Break",
        description: "Complete physical break in the fiber causing total signal loss. This is one of the most severe faults in fiber optic networks.",
        severity: "high",
        troubleshooting: [
            "Use OTDR to locate the exact position of the break",
            "Excavate the area carefully if underground",
            "Replace the damaged section of fiber",
            "Perform fusion splicing on both ends",
            "Test with OTDR from both directions to verify repair quality"
        ]
    },
    'macrobend': {
        name: "Macrobend",
        description: "Excessive bending of the fiber beyond its minimum bend radius, causing significant signal loss. Often occurs during installation or when fiber is improperly routed.",
        severity: "medium",
        troubleshooting: [
            "Use VFL to visually locate the bend",
            "Carefully reroute the fiber to eliminate sharp bends",
            "Ensure proper bend radius is maintained",
            "Secure fiber with appropriate fixtures",
            "Retest signal levels after correction"
        ]
    },
    'microbend': {
        name: "Microbend",
        description: "Small-scale bends in the fiber caused by pressure points, pinching, or improper installation. These can be difficult to locate visually.",
        severity: "medium",
        troubleshooting: [
            "Use OTDR to identify the general location",
            "Inspect fiber path for pressure points or improper mounting",
            "Release fiber from any compression points",
            "Ensure proper installation in trays and enclosures",
            "Verify signal improvement with power meter"
        ]
    },
    'connector': {
        name: "Bad Connector",
        description: "Damaged, worn, or improperly terminated connector causing signal reflection and loss. Often characterized by high reflectance values in OTDR traces.",
        severity: "medium",
        troubleshooting: [
            "Inspect connector end face with microscope",
            "Clean connector if contaminated",
            "If damaged, replace connector",
            "Ensure proper polishing and termination",
            "Test insertion loss and back reflection"
        ]
    },
    'splice': {
        name: "Poor Splice",
        description: "Suboptimal fusion or mechanical splice causing signal loss. May be due to misalignment, contamination, or improper fusion parameters.",
        severity: "medium",
        troubleshooting: [
            "Locate splice point using OTDR",
            "Open splice enclosure and inspect",
            "For mechanical splices, clean and redo",
            "For fusion splices, prepare fiber ends and re-splice",
            "Verify splice quality with OTDR from both directions"
        ]
    },
    'contamination': {
        name: "Connector Contamination",
        description: "Dirt, dust, or oils on connector end faces causing signal scattering and loss. One of the most common and preventable issues.",
        severity: "low",
        troubleshooting: [
            "Inspect connector with fiber microscope",
            "Clean using appropriate fiber cleaning tools",
            "Use dry cleaning first, then solvent if needed",
            "Re-inspect to confirm cleanliness",
            "Test signal levels after cleaning"
        ]
    },
    'stress': {
        name: "Stress Point",
        description: "Localized stress on the fiber causing gradual signal degradation. Often occurs at mounting points or where fiber is improperly secured.",
        severity: "low",
        troubleshooting: [
            "Use OTDR to identify the general location",
            "Inspect fiber path for improper mounting or stress points",
            "Relieve stress by adjusting mounting hardware",
            "Add proper strain relief where needed",
            "Monitor signal levels over time to ensure stability"
        ]
    },
    'ghosting': {
        name: "Ghost Reflection",
        description: "False reflections in OTDR traces caused by multiple reflective events. These can be misleading during troubleshooting.",
        severity: "low",
        troubleshooting: [
            "Identify true events vs. ghost reflections",
            "Test from opposite end to confirm",
            "Use proper OTDR settings and pulse width",
            "Address high-reflectance connectors in the path",
            "Document known ghost reflections for future reference"
        ]
    }
};

class FiberFaultSimulator {
    constructor(faultCanvasId, otdrCanvasId) {
        this.faultCanvas = document.getElementById(faultCanvasId);
        this.otdrCanvas = document.getElementById(otdrCanvasId);
        
        if (!this.faultCanvas || !this.otdrCanvas) {
            throw new Error("Canvas elements not found");
        }
        
        this.faultCtx = this.faultCanvas.getContext('2d');
        this.otdrCtx = this.otdrCanvas.getContext('2d');
        
        // Set canvas dimensions
        this.faultCanvas.width = this.faultCanvas.offsetWidth;
        this.faultCanvas.height = this.faultCanvas.offsetHeight;
        this.otdrCanvas.width = this.otdrCanvas.offsetWidth;
        this.otdrCanvas.height = this.otdrCanvas.offsetHeight;
        
        // Initialize visualization
        this.drawFiberLine();
        this.drawOTDRBaseline();
    }

    // Draw the basic fiber line
    drawFiberLine() {
        this.faultCtx.clearRect(0, 0, this.faultCanvas.width, this.faultCanvas.height);
        
        // Draw fiber path
        this.faultCtx.beginPath();
        this.faultCtx.moveTo(50, 150);
        this.faultCtx.lineTo(550, 150);
        this.faultCtx.strokeStyle = "#2196F3";
        this.faultCtx.lineWidth = 3;
        this.faultCtx.stroke();
        
        // Draw distance markers
        for (let i = 0; i <= 5; i++) {
            const x = 50 + i * 100;
            this.faultCtx.beginPath();
            this.faultCtx.moveTo(x, 160);
            this.faultCtx.lineTo(x, 170);
            this.faultCtx.strokeStyle = "#666";
            this.faultCtx.lineWidth = 1;
            this.faultCtx.stroke();
            
            this.faultCtx.fillStyle = "#666";
            this.faultCtx.font = "12px Arial";
            this.faultCtx.textAlign = "center";
            this.faultCtx.fillText(`${i}km`, x, 185);
        }
        
        // Draw connectors at both ends
        this.drawConnector(50, 150);
        this.drawConnector(550, 150);
    }

    // Draw a connector
    drawConnector(x, y) {
        this.faultCtx.fillStyle = "#1976D2";
        this.faultCtx.fillRect(x - 5, y - 10, 10, 20);
    }

    // Draw OTDR baseline
    drawOTDRBaseline() {
        this.otdrCtx.clearRect(0, 0, this.otdrCanvas.width, this.otdrCanvas.height);
        
        // Draw axes
        this.otdrCtx.beginPath();
        this.otdrCtx.moveTo(50, 30);
        this.otdrCtx.lineTo(50, 120);
        this.otdrCtx.lineTo(550, 120);
        this.otdrCtx.strokeStyle = "#666";
        this.otdrCtx.lineWidth = 1;
        this.otdrCtx.stroke();
        
        // Draw baseline trace
        this.otdrCtx.beginPath();
        this.otdrCtx.moveTo(50, 50);
        this.otdrCtx.lineTo(550, 90);  // Slight downward slope for normal attenuation
        this.otdrCtx.strokeStyle = "#4CAF50";
        this.otdrCtx.lineWidth = 2;
        this.otdrCtx.stroke();
        
        // Draw distance markers
        for (let i = 0; i <= 5; i++) {
            const x = 50 + i * 100;
            this.otdrCtx.beginPath();
            this.otdrCtx.moveTo(x, 120);
            this.otdrCtx.lineTo(x, 125);
            this.otdrCtx.strokeStyle = "#666";
            this.otdrCtx.lineWidth = 1;
            this.otdrCtx.stroke();
            
            this.otdrCtx.fillStyle = "#666";
            this.otdrCtx.font = "10px Arial";
            this.otdrCtx.textAlign = "center";
            this.otdrCtx.fillText(`${i}km`, x, 135);
        }
    }

    drawFiberBreak(x) {
        // Draw break
        this.faultCtx.beginPath();
        this.faultCtx.moveTo(x - 10, 140);
        this.faultCtx.lineTo(x + 10, 160);
        this.faultCtx.moveTo(x - 10, 160);
        this.faultCtx.lineTo(x + 10, 140);
        this.faultCtx.strokeStyle = "#F44336";
        this.faultCtx.lineWidth = 2;
        this.faultCtx.stroke();
        
        // Draw OTDR trace for break
        this.otdrCtx.beginPath();
        this.otdrCtx.moveTo(50, 50);
        this.otdrCtx.lineTo(x, 70);
        this.otdrCtx.lineTo(x, 35);  // Reflection spike
        this.otdrCtx.lineTo(x + 2, 120);  // Complete loss
        this.otdrCtx.lineTo(550, 120);
        this.otdrCtx.strokeStyle = "#F44336";
        this.otdrCtx.lineWidth = 2;
        this.otdrCtx.stroke();
    }

    drawMacrobend(x) {
        // Draw large bend
        this.faultCtx.beginPath();
        this.faultCtx.moveTo(x - 50, 150);
        this.faultCtx.quadraticCurveTo(x, 220, x + 50, 150);
        this.faultCtx.strokeStyle = "#FF9800";
        this.faultCtx.lineWidth = 3;
        this.faultCtx.stroke();
        
        // Draw OTDR trace for macrobend
        this.otdrCtx.beginPath();
        this.otdrCtx.moveTo(50, 50);
        this.otdrCtx.lineTo(x - 10, 70);
        this.otdrCtx.lineTo(x, 85);  // Loss at bend
        this.otdrCtx.lineTo(550, 100);  // Higher attenuation after bend
        this.otdrCtx.strokeStyle = "#FF9800";
        this.otdrCtx.lineWidth = 2;
        this.otdrCtx.stroke();
    }

    drawMicrobend(x) {
        // Draw multiple small bends
        this.faultCtx.beginPath();
        this.faultCtx.moveTo(x - 30, 150);
        for (let i = 0; i < 6; i++) {
            this.faultCtx.quadraticCurveTo(
                x - 20 + i * 10, 140 + (i % 2) * 20,
                x - 10 + i * 10, 150
            );
        }
        this.faultCtx.strokeStyle = "#FF9800";
        this.faultCtx.lineWidth = 3;
        this.faultCtx.stroke();
        
        // Draw OTDR trace for microbend
        this.otdrCtx.beginPath();
        this.otdrCtx.moveTo(50, 50);
        this.otdrCtx.lineTo(x, 70);
        this.otdrCtx.lineTo(x + 30, 80);  // Gradual loss
        this.otdrCtx.lineTo(550, 95);
        this.otdrCtx.strokeStyle = "#FF9800";
        this.otdrCtx.lineWidth = 2;
        this.otdrCtx.stroke();
    }

    drawBadConnector(x) {
        // Draw damaged connector
        this.faultCtx.fillStyle = "#F44336";
        this.faultCtx.fillRect(x - 8, 140, 16, 20);
        
        // Draw warning symbol
        this.faultCtx.beginPath();
        this.faultCtx.moveTo(x, 145);
        this.faultCtx.lineTo(x + 5, 155);
        this.faultCtx.lineTo(x - 5, 155);
        this.faultCtx.closePath();
        this.faultCtx.fillStyle = "#FFEB3B";
        this.faultCtx.fill();
        
        // Draw OTDR trace for bad connector
        this.otdrCtx.beginPath();
        this.otdrCtx.moveTo(50, 50);
        this.otdrCtx.lineTo(x, 70);
        this.otdrCtx.lineTo(x, 40);  // High reflection spike
        this.otdrCtx.lineTo(x + 2, 85);  // Loss after connector
        this.otdrCtx.lineTo(550, 100);
        this.otdrCtx.strokeStyle = "#F44336";
        this.otdrCtx.lineWidth = 2;
        this.otdrCtx.stroke();
    }

    drawPoorSplice(x) {
        // Draw misaligned splice
        this.faultCtx.fillStyle = "#FF9800";
        this.faultCtx.fillRect(x - 10, 145, 20, 10);
        
        // Draw misalignment lines
        this.faultCtx.beginPath();
        this.faultCtx.moveTo(x - 10, 150);
        this.faultCtx.lineTo(x - 5, 150);
        this.faultCtx.moveTo(x + 5, 153);
        this.faultCtx.lineTo(x + 10, 153);
        this.faultCtx.strokeStyle = "#2196F3";
        this.faultCtx.lineWidth = 2;
        this.faultCtx.stroke();
        
        // Draw OTDR trace for poor splice
        this.otdrCtx.beginPath();
        this.otdrCtx.moveTo(50, 50);
        this.otdrCtx.lineTo(x, 70);
        this.otdrCtx.lineTo(x + 2, 80);  // Step loss
        this.otdrCtx.lineTo(550, 95);
        this.otdrCtx.strokeStyle = "#FF9800";
        this.otdrCtx.lineWidth = 2;
        this.otdrCtx.stroke();
    }

    drawContamination(x) {
        // Draw connector
        this.faultCtx.fillStyle = "#1976D2";
        this.faultCtx.fillRect(x - 8, 140, 16, 20);
        
        // Draw contamination particles
        for (let i = 0; i < 8; i++) {
            const particleX = x - 6 + Math.random() * 12;
            const particleY = 145 + Math.random() * 10;
            this.faultCtx.beginPath();
            this.faultCtx.arc(particleX, particleY, 1, 0, Math.PI * 2);
            this.faultCtx.fillStyle = "#795548";
            this.faultCtx.fill();
        }
        
        // Draw OTDR trace for contamination
        this.otdrCtx.beginPath();
        this.otdrCtx.moveTo(50, 50);
        this.otdrCtx.lineTo(x, 70);
        this.otdrCtx.lineTo(x, 65);  // Small reflection
        this.otdrCtx.lineTo(x + 2, 75);  // Small loss
        this.otdrCtx.lineTo(550, 90);
        this.otdrCtx.strokeStyle = "#795548";
        this.otdrCtx.lineWidth = 2;
        this.otdrCtx.stroke();
    }

    drawStressPoint(x) {
        // Draw pressure indicator
        this.faultCtx.beginPath();
        this.faultCtx.moveTo(x, 120);
        this.faultCtx.lineTo(x, 180);
        this.faultCtx.strokeStyle = "#F44336";
        this.faultCtx.lineWidth = 1;
        this.faultCtx.stroke();
        
        // Draw arrows
        this.drawArrow(x, 120, 140);
        this.drawArrow(x, 180, 160);
        
        // Draw OTDR trace for stress point
        this.otdrCtx.beginPath();
        this.otdrCtx.moveTo(50, 50);
        this.otdrCtx.lineTo(x - 20, 70);
        this.otdrCtx.lineTo(x + 20, 80);  // Gradual loss at stress point
        this.otdrCtx.lineTo(550, 95);
        this.otdrCtx.strokeStyle = "#F44336";
        this.otdrCtx.lineWidth = 2;
        this.otdrCtx.stroke();
    }

    drawGhostReflection(x) {
        // Draw normal connector
        this.drawConnector(x, 150);
        
        // Draw ghost indicators
        this.faultCtx.beginPath();
        this.faultCtx.arc(x * 1.5, 150, 10, 0, Math.PI * 2);
        this.faultCtx.strokeStyle = "rgba(255, 152, 0, 0.5)";
        this.faultCtx.stroke();
        
        // Draw OTDR trace with ghost reflection
        this.otdrCtx.beginPath();
        this.otdrCtx.moveTo(50, 50);
        this.otdrCtx.lineTo(x, 70);
        this.otdrCtx.lineTo(x, 45);  // Real reflection
        this.otdrCtx.lineTo(x + 2, 75);
        this.otdrCtx.lineTo(x * 1.5, 85);
        this.otdrCtx.lineTo(x * 1.5, 65);  // Ghost reflection
        this.otdrCtx.lineTo(x * 1.5 + 2, 90);
        this.otdrCtx.lineTo(550, 100);
        this.otdrCtx.strokeStyle = "#FF9800";
        this.otdrCtx.lineWidth = 2;
        this.otdrCtx.stroke();
    }

    drawArrow(x, start, end) {
        const headSize = 5;
        this.faultCtx.beginPath();
        this.faultCtx.moveTo(x, start);
        this.faultCtx.lineTo(x, end);
        this.faultCtx.lineTo(x - headSize, end - headSize);
        this.faultCtx.moveTo(x, end);
        this.faultCtx.lineTo(x + headSize, end - headSize);
        this.faultCtx.strokeStyle = "#F44336";
        this.faultCtx.lineWidth = 1;
        this.faultCtx.stroke();
    }

    showFault(faultType) {
        if (!faultTypes[faultType]) return;
        
        const fault = faultTypes[faultType];
        
        // Draw fault visualization
        this.drawFiberLine();
        this.drawOTDRBaseline();
        
        const faultPosition = 300;  // Center of the visualization
        
        switch(faultType) {
            case 'break':
                this.drawFiberBreak(faultPosition);
                break;
            case 'macrobend':
                this.drawMacrobend(faultPosition);
                break;
            case 'microbend':
                this.drawMicrobend(faultPosition);
                break;
            case 'connector':
                this.drawBadConnector(faultPosition);
                break;
            case 'splice':
                this.drawPoorSplice(faultPosition);
                break;
            case 'contamination':
                this.drawContamination(faultPosition);
                break;
            case 'stress':
                this.drawStressPoint(faultPosition);
                break;
            case 'ghosting':
                this.drawGhostReflection(faultPosition);
                break;
        }
        
        return {
            name: fault.name,
            description: fault.description,
            severity: fault.severity,
            troubleshooting: fault.troubleshooting
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FiberFaultSimulator, faultTypes };
}
