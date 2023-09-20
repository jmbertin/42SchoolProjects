import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';

function ProjectDetailsScreen({route}) {
  const {project} = route.params;

  const correctionRules = project.project_sessions_rules
    .filter(rule => rule.rule.kind === 'correction')
    .map((rule, index) => {
      let description = rule.rule.description;

      rule.params.forEach(param => {
        description = description.replace('%{cursus}', param.value);
        description = description.replace('%{quests}', param.value);
        description = description.replace('%{projects}', param.value);
      });

      return (
        <Text style={styles.ruleText} key={index}>
          - {description}
        </Text>
      );
    });

  const retryRules = project.project_sessions_rules
    .filter(rule => rule.rule.kind === 'retriable')
    .map((rule, index) => {
      let description = rule.rule.description;

      rule.params.forEach(param => {
        description = description.replace('%{nbr_days}', `${param.value} days`);
      });

      return (
        <Text style={styles.ruleText} key={index}>
          - {description}
        </Text>
      );
    });

  let groupSizeDescription;

  if (project.solo) {
    groupSizeDescription = 'Solo project';
  } else {
    const groupValidationRule = project.project_sessions_rules.find(
      rule => rule.rule.kind === 'group_validation',
    );

    const groupSizeParams = groupValidationRule
      ? groupValidationRule.params.reduce((acc, param) => {
          if (param.param_id === 2) {
            acc.n = param.value;
          } else if (param.param_id === 3) {
            acc.m = param.value;
          }
          return acc;
        }, {})
      : null;

    if (groupSizeParams) {
      groupSizeDescription = `Between ${groupSizeParams.n} and ${groupSizeParams.m} students`;
    } else {
      groupSizeDescription = 'Group size information not available';
    }
  }

  return (
    <ImageBackground
      source={require('../../images/back.jpg')}
      style={styles.backgroundImage}>
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.cadre}>
            <Text style={styles.titleText}>{project.project.name}</Text>
          </View>
          <View style={styles.cadre}>
            <Text style={styles.infoText}>
              {project.difficulty} EXP / {project.estimate_time}
            </Text>
            <Text style={styles.infoText}>{groupSizeDescription}</Text>
          </View>
          <View style={styles.cadre}>
            <Text style={styles.sectionTitle}>Description:</Text>
            <Text style={styles.descriptionText}>{project.description}</Text>
          </View>
          <View style={styles.cadre}>
            <Text style={styles.sectionTitle}>Retry Rules:</Text>
            {retryRules}
          </View>
          <View style={styles.cadre}>
            <Text style={styles.sectionTitle}>Correction Rules:</Text>
            {correctionRules}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 8,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff00',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 18,
    color: '#00ff00',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 1,
    marginBottom: 4,
    color: '#00ff00',
    fontFamily: 'monospace',
  },
  descriptionText: {
    fontSize: 16,
    color: '#a0a0a0', // Couleur grise pour le texte descriptif
    fontFamily: 'monospace',
  },
  objectiveText: {
    fontSize: 16,
    color: '#a0a0a0',
    fontFamily: 'monospace',
  },
  ruleText: {
    fontSize: 16,
    color: '#a0a0a0',
    fontFamily: 'monospace',
  },
  cadre: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498db',
    padding: 5,
    marginBottom: 5,
  },
});

export default ProjectDetailsScreen;
