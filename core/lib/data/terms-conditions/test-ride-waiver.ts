import type { WaiverSection } from './interfaces';

// Test Ride Waiver content
export const testRideWaiverContent: {
  title: string;
  description: string;
  sections: WaiverSection[];
  minorsSection: {
    title: string;
    description: string;
    agreement: string;
  };
} = {
  title: 'PLEASE READ CAREFULLY BEFORE SIGNING!',
  description: 'I, the undersigned, in consideration of participating in free demonstration rides of electric mobility devices (the "Vehicles") provided by Ryddo LLC, a California limited liability company, state that I have read and understood and hereby expressly accept and agree to the following:',
  sections: [
    {
      id: 'risk-of-personal-injury',
      title: '1. Risk of Personal Injury.',
      content: 'I understand that the risks of riding the Vehicles are numerous and include, but are not limited to, the following: DEATH, PARALYSIS, HEAD INJURIES, BROKEN BONES, CUTS, SCRAPES, DAMAGE TO PROPERTIES, AND DAMAGE TO AND/OR INJURY TO OTHERS; falling, loss of control; encountering trees, limbs, brush, rocks, structures, ropes, barriers, and/or other man-made or naturally occurring obstacles; encountering unpredictable terrains such as varying steepness, mud, holes, cliffs, gravel, narrow trails, and/or lack of trails; negligence of other riders, persons, or vehicles; and/or negligent actions of Ryddo LLC, its employees, managers, officers, members or agents. I understand that risks from riding may include encountering bicycles, other electric mobility devices, motor vehicles, motorcycles and other motorized vehicles that may pose a hazard to me while riding the Vehicles. I understand that the risk of injury can increase due to inclement weather such as, but not limited to, snow, rain, hail, heat, and high winds. Injury can also occur due to inclement weather such as, but not limited to, heat exhaustion from extreme heat, frostbite from cold, and other injuries from rain, hail, snow, or other weather conditions.'
    },
    {
      id: 'conditions-and-representations',
      title: '2. Conditions and Representations.',
      type: 'numbered-list',
      items: [
        'I have made no misrepresentation to Ryddo LLC in any regard, including, but not limited to, age, abilities, or driver license status. I understand that a rider must be at least 16 years old and has a valid driver\'s license for the free demonstration rides of the Vehicles.',
        'All instructions for use of the Vehicles have been made clear to me and I fully understand how to use the Vehicles. I accept the Vehicles for use as is, and accept full responsibility for the care of the Vehicles while it is in my possession.',
        'I understand how to operate the Vehicles in a safe manner.',
        'I have a helmet, or one has been provided to me and I will wear a helmet at all times. I understand that wearing a helmet may decrease my risk of head injury.',
        'The Vehicles are working properly. I am physically and mentally able to ride the Vehicles and I am familiar with the riding and their physical and mental requirements and risks involved.',
        'I will read and follow all instructions and signs.',
        'I am aware of the costs associated with the Vehicles\' damage including but not limited to the price for each model of the Vehicles. I agree that I assume responsibility for a complete replacement for any and all damage done to the Vehicles due to my own misuse, accidents, other riders, or if lost or stolen, and/or any other circumstances.'
      ]
    },
    {
      id: 'release-of-liability',
      title: '3. Release of all liability (including negligence).',
      content: '<strong>I AGREE TO FULLY RELEASE AND DISCHARGE RYDDO LLC, ITS EMPLOYEES, managers, officers, members, and agents FROM ANY LIABILITY FOR ANY DAMAGES, INJURIES, OR CLAIMS, INCLUDING ANY INJURIES OR DAMAGES OCCURRING FROM ANY NEGLIGENCE (WHETHER ACTIVE, PASSIVE, SOLE, CONCURRENT OR GROSS), STRICT LIABILITY OR OTHER FAULT OF RYDDO LLC TO MYSELF OR ANY OTHER PERSON OR PROPERTY, AS A RESULT, MY PARTICIPATION IN THE FREE DEMONSTRATION RIDES OF THE VEHICLES. I FULLY UNDERSTAND AND AGREE TO RELEASE RYDDO LLC, ITS EMPLOYEES, managers, officers, members, and agents FOR THEIR NEGLIGENCE (WHETHER ACTIVE, PASSIVE, SOLE, CONCURRENT OR GROSS) IN CAUSING IN WHOLE OR IN PART ANY INJURY TO ME.</strong>'
    },
    {
      id: 'express-assumption-of-risks',
      title: '4. Express Assumption of Risks.',
      content: '<strong>I EXPRESSLY ASSUME ALL DANGERS INCIDENTAL TO, AND RISK OF LOSS, DAMAGE, OR INJURY OCCURRING AS A RESULT OF, PARTICIPATING IN THE FREE DEMONSTRATION RIDES OF THE VEHICLES, INCLUDING BUT NOT LIMITED TO THE RISK OF RYDDO LLC\'S NEGLIGENCE (WHETHER ACTIVE, PASSIVE, SOLE, CONCURRENT OR GROSS).</strong>'
    },
    {
      id: 'promise-not-to-sue',
      title: '5. Promise Not to Sue and Hold Harmless.',
      content: '<strong>I AGREE NO LAWSUIT WILL BE FILED BY ME OR ON MY BEHALF AGAINST RYDDO LLC, ITS EMPLOYEES, managers, officers, members, OR agents as</strong> a result of my participation in the free demonstration rides of the Vehicles. If I do file a lawsuit, I agree to pay any attorney fees, costs, or judgments incurred by Ryddo LLC, its employees, managers, officers, members, or agents even if Ryddo LLC, its employees, managers, officers, members, or agents are found negligent. I further agree to indemnify Ryddo LLC, its employees, managers, officers, members, and agents from any liability and hold them harmless for any damages, injuries, judgments, or lawsuits, including any attorney\'s fees and costs incurred by Ryddo LLC, its employees, managers, officers, members, and agents as a result of my participation in free demonstration rides of the Vehicles or any lawsuits resulting from such participation. <strong>I AGREE MY OBLIGATION TO INDEMNIFY AND HOLD RYDDO LLC, ITS EMPLOYEES, managers, officers, members, AND agents HARMLESS APPLIES EVEN IF RYDDO LLC, ITS EMPLOYEES, managers, officers, members OR agents ARE NEGLIGENT (WHETHER ACTIVE, PASSIVE, SOLE, CONCURRENT OR GROSS).</strong> I understand this is a contract, which limits my legal right, and it is binding upon me, my heirs, and my legal representative. If portions of this agreement are invalid, it is agreed the remaining portion will remain intact and enforceable. By signing the Release of Liability, the undersigned acknowledges he/she fully read and understands the above and foregoing.'
    },
    {
      id: 'photography-and-video-release',
      title: '6. Photography and Video Release.',
      content: 'I grant Ryddo LLC, its employees, managers, officers, members, or agents the right to take photographs and/or videos of me while engaged in the use of the Vehicles and further grant the publication of same on company\'s website or social media for the purpose of publicity, illustration, or advertising and expect no compensation.'
    }
  ],
  minorsSection: {
    title: 'Minors: Minimum age 16 years old.',
    description: 'Prospective participants under the age of 18 years are required to have a parent or legal guardian read and also sign this Release. The parent and the participant under 18 have read, understand, and agree to comply with this release.',
    agreement: 'BY SIGNING THIS DOCUMENT, THE PARENT OR LEGAL GUARDIAN AGREES TO EACH OF THE PROVISIONS ABOVE INCLUDING TO INDEMNIFY AND HOLD RYDDO LLC, ITS EMPLOYEES, managers, officers, members, and agents harmless from ANY AND ALL CLAIMS BROUGHT BY THE PARTICIPANT UNDER 18 OR RESULTING FROM THE PARTICIPANT UNDER 18\'S ACTIONS, REGARDLESS OF THE NEGLIGENCE (WHETHER ACTIVE, PASSIVE, SOLE, CONCURRENT OR GROSS) OF RYDDO LLC, ITS EMPLOYEES, managers, officers, members OR agents.'
  }
}; 